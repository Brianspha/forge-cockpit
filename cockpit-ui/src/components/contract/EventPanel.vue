<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  import type { ProcessedEvent } from '../../types';

  const props = defineProps<{
    events: ProcessedEvent[];
    isDeployed: boolean;
  }>();

  const search = ref('');
  const filterType = ref('all');
  const details = ref(new Set<string>());
  const visibleCount = ref(50);
  const scrollContainer = ref<HTMLElement>();

  const types = computed(() => [
    'all',
    ...new Set(props.events.map(e => e.eventName)),
  ]);

  const filtered = computed(() => {
    if (!props.events || props.events.length === 0) return [];

    return props.events.filter(e => {
      const matchType =
        filterType.value === 'all' || e.eventName === filterType.value;
      const term = search.value.trim().toLowerCase();
      const matchSearch =
        term === '' ||
        [
          e.eventName,
          e.transactionHash,
          e.address,
          JSON.stringify(e.args || {}),
          ...(e.topics || []),
        ].some(f =>
          String(f || '')
            .toLowerCase()
            .includes(term)
        );
      return matchType && matchSearch;
    });
  });

  const visibleEvents = computed(() => {
    return filtered.value.slice(0, visibleCount.value).map((event, index) => ({
      ...event,
      blockNumber: String(event.blockNumber),
      id: event.id || `${event.transactionHash}-${event.logIndex}-${index}`,
    }));
  });

  const hasMore = computed(() => filtered.value.length > visibleCount.value);

  function toggle(id: string) {
    details.value.has(id) ? details.value.delete(id) : details.value.add(id);
  }

  function loadMore() {
    visibleCount.value += 50;
  }

  function fmtHash(h: string) {
    return h ? `${h.slice(0, 8)}...${h.slice(-6)}` : '';
  }

  function formatTimestamp(hexTimestamp: string) {
    try {
      const timestamp = parseInt(hexTimestamp, 16);
      const date = new Date(timestamp * 1000);
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const minutes = Math.floor(diff / (1000 * 60));
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      let relative = '';
      if (days > 0) relative = `${days}d ago`;
      else if (hours > 0) relative = `${hours}h ago`;
      else if (minutes > 0) relative = `${minutes}m ago`;
      else relative = 'Just now';

      return {
        full: date.toLocaleString(),
        relative,
      };
    } catch {
      return { full: 'Invalid Date', relative: '' };
    }
  }

  function getEventTypeColor(eventName: string) {
    const colors = [
      '#10b981',
      '#3b82f6',
      '#f59e0b',
      '#059669',
      '#dc2626',
      '#8b5cf6',
      '#06b6d4',
      '#ef4444',
      '#6366f1',
      '#84cc16',
      '#f97316',
      '#ec4899',
    ];

    let hash = 0;
    for (let i = 0; i < eventName.length; i++) {
      hash = ((hash << 5) - hash + eventName.charCodeAt(i)) & 0xffffffff;
    }

    return colors[Math.abs(hash) % colors.length];
  }

  function formatArgValue(value: any): string {
    if (typeof value === 'string' && value.startsWith('0x')) {
      return fmtHash(value);
    }
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  }

  function handleScroll() {
    if (!scrollContainer.value) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainer.value;
    if (scrollTop + clientHeight >= scrollHeight - 100 && hasMore.value) {
      loadMore();
    }
  }

  onMounted(() => {
    scrollContainer.value?.addEventListener('scroll', handleScroll);
  });

  onUnmounted(() => {
    scrollContainer.value?.removeEventListener('scroll', handleScroll);
  });
</script>

<template>
  <div class="events-container">
    <div v-if="!isDeployed" class="empty-state">
      <div class="empty-icon">📄</div>
      <h3>No Contract Deployed</h3>
      <p>
        Deploy your contract first to start tracking events and interactions
      </p>
    </div>

    <div v-else-if="events.length === 0" class="empty-state">
      <div class="empty-icon">⚡</div>
      <h3>No Events Yet</h3>
      <p>Interact with your contract functions to see events appear here</p>
    </div>

    <div v-else class="events-panel">
      <div class="panel-header">
        <div class="header-info">
          <h3>Contract Events</h3>
          <span class="event-count">
            {{ filtered.length }} event{{ filtered.length !== 1 ? 's' : '' }}
          </span>
        </div>

        <div class="controls">
          <div class="search-group">
            <input v-model="search" placeholder="Search events..." />
          </div>
          <select v-model="filterType" class="filter-select">
            <option v-for="t in types" :key="t" :value="t">
              {{ t === 'all' ? 'All Types' : t }}
            </option>
          </select>
        </div>
      </div>

      <div ref="scrollContainer" class="event-list">
        <div v-for="e in visibleEvents" :key="e.id" class="event-card">
          <div class="event-header" @click="toggle(e.id)">
            <div
              class="event-indicator"
              :style="{ backgroundColor: getEventTypeColor(e.eventName) }"
            ></div>

            <div class="event-content">
              <div class="event-title-row">
                <span
                  class="event-name"
                  :style="{ color: getEventTypeColor(e.eventName) }"
                >
                  {{ e.eventName }}
                </span>
                <div class="event-badges">
                  <span class="block-badge">#{{ e.blockNumber }}</span>
                  <span class="time-badge">
                    {{ formatTimestamp(e.blockTimestamp).relative }}
                  </span>
                </div>
              </div>

              <div class="event-meta">
                <div class="meta-item">
                  <span>Contract:</span>
                  <code>{{ fmtHash(e.address) }}</code>
                </div>
                <div class="meta-item">
                  <span>Transaction:</span>
                  <code>{{ fmtHash(e.transactionHash) }}</code>
                </div>
                <div class="meta-item">
                  <span>Time:</span>
                  <span>{{ formatTimestamp(e.blockTimestamp).full }}</span>
                </div>
              </div>
            </div>

            <div class="expand-icon" :class="{ expanded: details.has(e.id) }">
              {{ details.has(e.id) ? '−' : '+' }}
            </div>
          </div>

          <div v-if="details.has(e.id)" class="event-details">
            <div class="details-grid">
              <div class="detail-section">
                <h4>Transaction Details</h4>
                <div class="detail-item">
                  <label>Hash</label>
                  <code>{{ fmtHash(e.transactionHash) }}</code>
                </div>
                <div class="detail-item">
                  <label>Block Hash</label>
                  <code>{{ fmtHash(e.blockHash) }}</code>
                </div>
                <div class="detail-row">
                  <div class="detail-item">
                    <label>Tx Index</label>
                    <span>{{ e.transactionIndex }}</span>
                  </div>
                  <div class="detail-item">
                    <label>Log Index</label>
                    <span>{{ e.logIndex }}</span>
                  </div>
                </div>
              </div>

              <div
                v-if="e.args && Object.keys(e.args).length"
                class="detail-section"
              >
                <h4>Arguments</h4>
                <div
                  v-for="(value, key) in e.args"
                  :key="key"
                  class="detail-item"
                >
                  <label>{{ key }}</label>
                  <code>{{ formatArgValue(value) }}</code>
                </div>
              </div>

              <div v-if="e.topics?.length" class="detail-section full-width">
                <h4>Topics</h4>
                <div
                  v-for="(topic, i) in e.topics"
                  :key="i"
                  class="detail-item"
                >
                  <label>Topic {{ i }}</label>
                  <code>{{ topic }}</code>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="hasMore" class="load-more-container">
          <button @click="loadMore" class="load-more-btn">
            Load {{ Math.min(50, filtered.length - visibleCount) }} more events
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .events-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--vscode-editor-background, #1e1e1e);
    color: var(--vscode-editor-foreground, #cccccc);
    font-family: var(--vscode-font-family, 'Segoe UI', system-ui, sans-serif);
  }

  .empty-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 24px;
    padding: 64px 32px;
    text-align: center;
  }

  .empty-icon {
    font-size: 48px;
    opacity: 0.3;
    color: var(--vscode-descriptionForeground, #858585);
  }

  .empty-state h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--vscode-editor-foreground, #cccccc);
  }

  .empty-state p {
    color: var(--vscode-descriptionForeground, #858585);
    margin: 0;
    font-size: 14px;
    max-width: 300px;
    line-height: 1.5;
  }

  .events-panel {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .panel-header {
    padding: 0 0 20px;
    border-bottom: 1px solid var(--border-color, #3c3c3c);
    margin-bottom: 16px;
  }

  .header-info {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }

  .header-info h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--vscode-editor-foreground, #cccccc);
  }

  .event-count {
    background: var(--vscode-badge-background, #414347);
    color: var(--vscode-badge-foreground, #cccccc);
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 500;
  }

  .controls {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .search-group {
    flex: 1;
    max-width: 300px;
  }

  .search-group input {
    width: 100%;
    padding: 8px 12px;
    background: var(--vscode-input-background, #2d2d30);
    border: 1px solid var(--border-color, #3c3c3c);
    border-radius: 6px;
    color: var(--vscode-input-foreground, #cccccc);
    font-size: 13px;
    outline: none;
    font-family: inherit;
  }

  .search-group input:focus {
    border-color: var(--primary-color, #007acc);
  }

  .search-group input::placeholder {
    color: var(--vscode-input-placeholderForeground, #858585);
  }

  .filter-select {
    padding: 8px 12px;
    background: var(--vscode-dropdown-background, #2d2d30);
    border: 1px solid var(--border-color, #3c3c3c);
    border-radius: 6px;
    color: var(--vscode-dropdown-foreground, #cccccc);
    font-size: 13px;
    outline: none;
    cursor: pointer;
    min-width: 120px;
    font-family: inherit;
  }

  .filter-select:focus {
    border-color: var(--primary-color, #007acc);
  }

  .event-list {
    flex: 1;
    overflow-y: auto;
  }

  .event-list::-webkit-scrollbar {
    width: 6px;
  }

  .event-list::-webkit-scrollbar-track {
    background: transparent;
  }

  .event-list::-webkit-scrollbar-thumb {
    background: var(--vscode-scrollbarSlider-background, #464647);
    border-radius: 3px;
  }

  .event-card {
    background: var(--panel-bg, #252526);
    border: 1px solid var(--border-color, #3c3c3c);
    border-radius: 8px;
    margin-bottom: 12px;
    overflow: hidden;
    transition: all 0.2s ease;
  }

  .event-card:hover {
    border-color: var(--vscode-list-hoverBackground, #464647);
    transform: translateY(-1px);
  }

  .event-header {
    display: flex;
    align-items: flex-start;
    padding: 16px;
    cursor: pointer;
    user-select: none;
    gap: 12px;
  }

  .event-header:hover {
    background: var(--hover-bg, #2a2a2b);
  }

  .event-indicator {
    width: 4px;
    height: 40px;
    border-radius: 2px;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .event-content {
    flex: 1;
    min-width: 0;
  }

  .event-title-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .event-name {
    font-weight: 600;
    font-size: 15px;
  }

  .event-badges {
    display: flex;
    gap: 6px;
    align-items: center;
  }

  .block-badge {
    background: var(--vscode-gitDecoration-addedResourceForeground, #4caf50);
    color: white;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 600;
    font-family: var(--vscode-editor-font-family, monospace);
  }

  .time-badge {
    background: var(--vscode-badge-background, #414347);
    color: var(--vscode-badge-foreground, #cccccc);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 500;
  }

  .event-meta {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: var(--vscode-descriptionForeground, #858585);
  }

  .meta-item code {
    font-family: var(--vscode-editor-font-family, monospace);
    font-size: 11px;
    background: var(--vscode-textBlockQuote-background, #2d2d30);
    padding: 2px 4px;
    border-radius: 3px;
  }

  .expand-icon {
    color: var(--vscode-descriptionForeground, #858585);
    font-weight: bold;
    font-size: 18px;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    background: var(--vscode-input-background, #2d2d30);
    margin-top: 8px;
  }

  .expand-icon.expanded {
    background: var(--primary-color, #007acc);
    color: white;
  }

  .event-details {
    background: var(--vscode-editor-background, #1e1e1e);
    border-top: 1px solid var(--border-color, #3c3c3c);
    padding: 20px;
  }

  .details-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .detail-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .detail-section.full-width {
    grid-column: 1 / -1;
  }

  .detail-section h4 {
    margin: 0;
    font-size: 13px;
    font-weight: 600;
    color: var(--vscode-editor-foreground, #cccccc);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid var(--border-color, #3c3c3c);
    padding-bottom: 6px;
  }

  .detail-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .detail-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .detail-item label {
    font-size: 11px;
    font-weight: 500;
    color: var(--vscode-descriptionForeground, #858585);
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }

  .detail-item code {
    font-family: var(--vscode-editor-font-family, monospace);
    font-size: 12px;
    background: var(--vscode-input-background, #2d2d30);
    padding: 8px 10px;
    border-radius: 6px;
    color: var(--vscode-editor-foreground, #d4d4d4);
    border: 1px solid var(--border-color, #3c3c3c);
    word-break: break-all;
    line-height: 1.4;
  }

  .detail-item span {
    color: var(--vscode-editor-foreground, #cccccc);
    padding: 4px 0;
  }

  .load-more-container {
    display: flex;
    justify-content: center;
    padding: 20px;
  }

  .load-more-btn {
    padding: 8px 16px;
    background: var(--vscode-button-background, #2d2d30);
    border: 1px solid var(--border-color, #3c3c3c);
    border-radius: 6px;
    color: var(--vscode-button-foreground, #cccccc);
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: inherit;
  }

  .load-more-btn:hover {
    background: var(--vscode-button-hoverBackground, #3c3c3c);
  }

  @media (max-width: 768px) {
    .controls {
      flex-direction: column;
      align-items: stretch;
    }

    .search-group {
      max-width: none;
    }

    .details-grid {
      grid-template-columns: 1fr;
    }

    .detail-row {
      grid-template-columns: 1fr;
    }

    .event-title-row {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }
  }
</style>

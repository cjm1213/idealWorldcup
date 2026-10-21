import { THEMES } from './themes.js';
import { shuffle, photoPath, probeImage } from './utils.js';
import CandidateCard from './components/CandidateCard.js';

const { createApp, ref, reactive, computed, watch, onMounted, onUnmounted } = Vue;
const ALL_ROUNDS = [4, 8, 16, 32, 64, 128];

createApp({
  components: { CandidateCard },
  setup() {
    // ── 설정 ──
    const themeId = ref(THEMES[0].id);
    const size = ref(16);
    const onlyPhotos = ref(false);
    const found = reactive({});        // { 경로: true/false } 사진 존재 여부 캐시
    const checking = ref(false);

    const theme = computed(() => THEMES.find(t => t.id === themeId.value));
    const themeItems = computed(() => theme.value.items.map(item => {
      const src = photoPath(theme.value, item);
      return { ...item, img: found[src] ? src : null };
    }));
    const photoCount = computed(() => themeItems.value.filter(c => c.img).length);
    const pool = computed(() => onlyPhotos.value ? themeItems.value.filter(c => c.img) : themeItems.value);
    const maxRound = computed(() => ALL_ROUNDS.filter(n => n <= pool.value.length).pop() || 0);

    // 테마를 고를 때마다 images/<테마>/ 에 사진이 있는지 확인
    async function checkPhotos() {
      const t = theme.value;
      const todo = t.items.map(i => photoPath(t, i)).filter(src => !(src in found));
      if (!todo.length) return;
      checking.value = true;
      const results = await Promise.all(todo.map(probeImage));
      todo.forEach((src, i) => { found[src] = results[i]; });
      checking.value = false;
    }
    watch(themeId, () => { onlyPhotos.value = false; checkPhotos(); });
    watch(maxRound, m => { if (m && size.value > m) size.value = m; });   // 후보가 줄면 라운드 자동 조정

    // ── 게임 상태 ──
    const phase = ref('intro');        // intro → play → result
    const current = ref([]);           // 이번 라운드 참가자
    const next = ref([]);              // 다음 라운드 진출자
    const matchIndex = ref(0);
    const picked = ref(null);          // 선택 애니메이션 중인 카드 (0 | 1)
    const history = ref([]);           // { round, winner, loser }

    const pair = computed(() => current.value.slice(matchIndex.value * 2, matchIndex.value * 2 + 2));
    const roundLabel = computed(() => current.value.length === 2 ? '결승' : `${current.value.length}강`);
    const progress = computed(() => history.value.length / (size.value - 1) * 100);
    const champion = computed(() => next.value[0]);
    const championPath = computed(() =>
      history.value
        .filter(h => h.winner.name === champion.value?.name)
        .map(h => ({ round: h.round, opponent: h.loser.name })));

    function start() {
      if (!maxRound.value) return;
      current.value = shuffle(pool.value).slice(0, size.value);
      next.value = [];
      matchIndex.value = 0;
      history.value = [];
      picked.value = null;
      phase.value = 'play';
    }

    function choose(i) {
      if (picked.value !== null || phase.value !== 'play') return;   // 연타 방지
      picked.value = i;
      const [a, b] = pair.value;
      const winner = i === 0 ? a : b;
      const loser = i === 0 ? b : a;
      history.value.push({ round: roundLabel.value, winner, loser });

      setTimeout(() => {
        next.value.push(winner);
        picked.value = null;
        if (matchIndex.value + 1 < current.value.length / 2) {
          matchIndex.value++;                    // 같은 라운드 다음 경기
        } else if (next.value.length === 1) {
          phase.value = 'result';                // 우승 확정
        } else {
          current.value = shuffle(next.value);   // 다음 라운드
          next.value = [];
          matchIndex.value = 0;
        }
      }, 340);
    }

    const cardState = i => picked.value === null ? '' : (picked.value === i ? 'picked' : 'lost');

    const onKey = e => {
      if (phase.value !== 'play') return;
      if (e.key === 'ArrowLeft') choose(0);
      if (e.key === 'ArrowRight') choose(1);
    };
    onMounted(() => { window.addEventListener('keydown', onKey); checkPhotos(); });
    onUnmounted(() => window.removeEventListener('keydown', onKey));

    return {
      ALL_ROUNDS, themes: THEMES, themeId, theme, themeItems, size, onlyPhotos, photoCount, checking,
      pool, maxRound, phase, current, matchIndex, pair, roundLabel, progress, champion, championPath,
      start, choose, cardState,
    };
  },
}).mount('#app');

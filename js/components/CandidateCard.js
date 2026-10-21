// 후보 카드 한 장. 사진(item.img)이 있으면 사진, 없으면 이름 첫 글자 + 색상
import { gradient } from '../utils.js';

export default {
  name: 'CandidateCard',
  props: {
    item: { type: Object, required: true },
    state: { type: String, default: '' },   // '' | 'picked' | 'lost' | 'static'
  },
  emits: ['pick'],
  methods: { gradient },
  template: `
    <button class="card" :class="state" @click="$emit('pick')" :aria-label="item.name + ' 선택'">
      <div class="portrait" :style="{ background: item.img ? 'var(--sunken)' : gradient(item.name) }">
        <img v-if="item.img" :src="item.img" :alt="item.name">
        <span v-else>{{ item.name[0] }}</span>
      </div>
      <div class="meta">
        <span class="name">{{ item.name }}</span>
        <span class="sub" v-if="item.sub">{{ item.sub }}</span>
      </div>
    </button>`,
};

# 이상형월드컵

Vue 3(CDN) + 순수 ES 모듈로 만든 이상형월드컵입니다. 빌드 과정 없이 GitHub Pages에 그대로 올려서 씁니다.

## 폴더 구조

```
index.html                    화면 템플릿 (시작 / 대결 / 결과)
css/style.css                 스타일
js/main.js                    게임 로직 (라운드 진행, 선택, 결과)
js/themes.js                  테마·후보 데이터  ← 여기만 고치면 후보 추가/삭제
js/utils.js                   셔플, 색상, 사진 경로 규칙
js/components/CandidateCard.js 후보 카드 컴포넌트
images/<테마id>/<이름>.jpg     후보 사진
```

## 사진 넣기

사진은 `images/<테마id>/<후보 이름>.jpg` 규칙으로 찾습니다. 파일이 없으면 이름 첫 글자 카드로 대신 보여줍니다.

| 테마 | 폴더 | 예시 |
|---|---|---|
| 남자배우 | `images/actor-m/` | `images/actor-m/공유.jpg` |
| 여자배우 | `images/actor-f/` | `images/actor-f/아이유.jpg` |
| 아이돌 | `images/idol/` | `images/idol/카리나.jpg` |
| 애니·게임 캐릭터 | `images/chara/` | `images/chara/고죠 사토루.jpg` |
| 음식 | `images/food/` | `images/food/떡볶이.jpg` |

- 파일 이름은 `themes.js`에 적힌 이름과 **띄어쓰기까지 똑같아야** 합니다.
- 확장자가 jpg가 아니면 테마에 `ext: 'png'`를 추가하거나, 후보를 `{ name: '공유', sub: '도깨비', img: 'images/actor-m/gongyoo.webp' }`처럼 직접 지정하세요.
- 세로 3:4 비율, 긴 변 600px 정도면 충분합니다. 큰 원본을 그대로 올리면 로딩이 느려집니다.

## 테마 추가

`js/themes.js`의 `THEMES` 배열에 하나 더 넣으면 됩니다.

```js
{ id: 'cat', label: '고양이', items: parse(`
  치즈|코리안 숏헤어, 보리|러시안 블루, 까망이
`) },
```

후보 수에 따라 열리는 라운드가 정해집니다 (4 · 8 · 16 · 32 · 64 · 128강). 후보가 라운드보다 많으면 랜덤으로 뽑습니다.

## 로컬에서 실행

ES 모듈이라 `index.html`을 더블클릭(file://)하면 동작하지 않습니다. 로컬 서버로 여세요.

```bash
npx serve .
# 또는
python3 -m http.server 8080
```

## GitHub Pages 배포

1. 저장소에 이 폴더 내용을 올립니다 (`index.html`이 저장소 루트에 오도록).
2. 저장소 **Settings → Pages → Build and deployment**에서 Source를 `Deploy from a branch`, 브랜치를 `main` / `/ (root)`로 지정합니다.
3. 1~2분 뒤 `https://<아이디>.github.io/<저장소이름>/`에서 열립니다.

모든 경로가 상대 경로라 저장소 이름이 무엇이든 그대로 동작합니다. `.nojekyll` 파일은 GitHub Pages가 파일을 가공하지 않도록 넣어둔 것이니 지우지 마세요.

> 공개 저장소에 연예인 사진을 올리면 누구나 볼 수 있습니다. 혼자 쓰거나 팀끼리만 쓸 거라면 저장소 공개 범위를 확인하세요.

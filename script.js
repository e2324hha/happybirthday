const container = document.querySelector('.container');
const sections = document.querySelectorAll('section');
const numSections = sections.length;
let isScrolling = false;

// クラッカー要素の取得
const crackerLeft = document.querySelector('.cracker-left');
const crackerRight = document.querySelector('.cracker-right');

// 風船ボタンの取得
const balloonButton = document.getElementById('balloon-button'); // ID変更

// ボタンの状態を管理する変数 (true: ON, false: OFF)
let isBalloonBursting = false; // 初期状態はオフ（画像はoff.pngに対応）
let balloonIntervalId = null; // 風船を連続して増やすためのインターバルID

// 風船の基本アニメーション設定（CSSのnth-childに対応する部分）
const balloonAnimationSettings = [
    { left: '5%', background: '#ff9999', animationTime: '12s', delay: '0s' },
    { left: '10%', background: '#ffcc66', animationTime: '10s', delay: '0.5s' },
    { left: '15%', background: '#66ccff', animationTime: '14s', delay: '1s' },
    { left: '20%', background: '#99ff99', animationTime: '11s', delay: '1.5s' },
    { left: '25%', background: '#cc99ff', animationTime: '13s', delay: '2s' },
    { left: '30%', background: '#ff6699', animationTime: '9s', delay: '2.5s' },
    { left: '35%', background: '#ff9999', animationTime: '15s', delay: '3s' },
    { left: '40%', background: '#ffcc66', animationTime: '10s', delay: '3.5s' },
    { left: '45%', background: '#66ccff', animationTime: '12s', delay: '4s' },
    { left: '50%', background: '#99ff99', animationTime: '8s', delay: '4.5s' },
    { left: '55%', background: '#cc99ff', animationTime: '13s', delay: '5s' },
    { left: '60%', background: '#ff6699', animationTime: '11s', delay: '5.5s' },
    { left: '65%', background: '#ff9999', animationTime: '14s', delay: '6s' },
    { left: '70%', background: '#ffcc66', animationTime: '9s', delay: '6.5s' },
    { left: '75%', background: '#66ccff', animationTime: '16s', delay: '7s' },
    { left: '80%', background: '#99ff99', animationTime: '10s', delay: '7.5s' },
    { left: '85%', background: '#cc99ff', animationTime: '12s', delay: '8s' },
    { left: '90%', background: '#ff6699', animationTime: '14s', delay: '8.5s' },
    { left: '95%', background: '#ff9999', animationTime: '11s', delay: '9s' },
    { left: '0%', background: '#ffcc66', animationTime: '13s', delay: '9.5s' }
];

// --- 風船関連の関数 ---
function addSingleBalloon(settings) {
    const balloonContainer = document.getElementById('balloon-container');
    if (balloonContainer) {
        const newBalloon = document.createElement('div');
        newBalloon.style.left = settings.left;
        newBalloon.style.background = settings.background;
        newBalloon.style.animation = `fly ${settings.animationTime} ease-in-out infinite ${settings.delay}`;
        
        balloonContainer.appendChild(newBalloon);
    }
}

// 初期表示時に生成する風船の数
function createInitialBalloons(count) {
    const balloonContainer = document.getElementById('balloon-container');
    if (balloonContainer) {
        balloonContainer.innerHTML = ''; // 既存の風船要素をクリア
        for (let i = 0; i < count; i++) {
            const settings = balloonAnimationSettings[i % balloonAnimationSettings.length]; // 設定を循環利用
            addSingleBalloon(settings);
        }
    }
}

// --- LINEチャット関連のデータと関数 ---
const chatMessages = [
    { name: '2代目', text: '初代誕生日おめでとう！これからもずっと仲良くしてもらえると嬉しいです。変なもんいっぱい食べような！！' },
    { name: 'おるじじ', text: 'たんおめ～悔いのない一年にしてな' },
    { name: '引け～ん', text: '初代誕生日おめでとうこれからもスズキらしくハトポッポしててください' },
    { name: '4', text: 'はぴば！今度珍獣屋いこうね～' },
];

function createLineLeft(messageData) {
    const lineLeft = document.createElement('div');
    lineLeft.classList.add('line__left');

    /* ★★★ この部分が完全に削除されていることを確認 ★★★ */
    // const figure = document.createElement('figure');
    // const img = document.createElement('img');
    // img.src = 'image/icon.png';
    // figure.appendChild(img);
    /* ★★★ ここまで削除されていることを確認 ★★★ */

    const textContainer = document.createElement('div');
    textContainer.classList.add('line__left-text');

    const nameDiv = document.createElement('div');
    nameDiv.classList.add('name');
    nameDiv.textContent = messageData.name;

    const textDiv = document.createElement('div');
    textDiv.classList.add('text');
    textDiv.textContent = messageData.text;

    textContainer.appendChild(nameDiv);
    textContainer.appendChild(textDiv);

    /* ★★★ この行も削除されていることを確認 ★★★ */
    // lineLeft.appendChild(figure); // もし残っていたら削除
    lineLeft.appendChild(textContainer); // textContainerのみを直接追加

    return lineLeft;
}

// LINEメッセージを会話エリアに挿入
function populateLineContents() {
    const lineContents = document.getElementById('line__contents');
    if (lineContents) {
        lineContents.innerHTML = ''; // 既存のコンテンツをクリア
        chatMessages.forEach(message => {
            lineContents.appendChild(createLineLeft(message));
        });
    }
}

// --- 初期化処理: DOMが完全に読み込まれた後に実行 ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. 初期風船要素の生成と追加 (例: 20個)
    createInitialBalloons(20);

    // 2. LINEメッセージの挿入
    populateLineContents();

    // 4. 風船ボタンのイベントリスナー
    if (balloonButton) {
        // 初期画像設定
        balloonButton.style.backgroundImage = `url('images/off.png')`;

        balloonButton.addEventListener('click', () => {
            isBalloonBursting = !isBalloonBursting; // 状態を切り替え

            if (isBalloonBursting) {
                balloonButton.style.backgroundImage = `url('images/on.png')`;
                // ボタンがONの間、風船を連続して追加
                balloonIntervalId = setInterval(() => {
                    const randomSettingsIndex = Math.floor(Math.random() * balloonAnimationSettings.length);
                    const settings = balloonAnimationSettings[randomSettingsIndex];
                    addSingleBalloon(settings);
                }, 200); // 0.2秒ごとに風船を1個追加
            } else {
                balloonButton.style.backgroundImage = `url('images/off.png')`;
                // ボタンがOFFになったら、風船の追加を停止
                clearInterval(balloonIntervalId);
            }
        });
    }
});


// --- スクロールイベントリスナー: カードのようなスクロール制御 ---
container.addEventListener('scroll', () => {
    if (isScrolling) return; // 連続的なスクロールイベントを間引く
    isScrolling = true;

    requestAnimationFrame(() => { // スムーズなアニメーションのためにrafを使用
        const scrollTop = container.scrollTop;
        const windowHeight = window.innerHeight;

        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;

            // 各セクションがビューポート内にあるかどうかを判断
            if (scrollTop >= sectionTop && scrollTop < sectionTop + windowHeight) {
                section.classList.add('current');
                section.classList.remove('prev', 'next');
            } else if (scrollTop < sectionTop) {
                // 現在のセクションより上にある（スクロールで下から出てくる）
                section.classList.add('next');
                section.classList.remove('prev', 'current');
            } else {
                // 現在のセクションより下にある（スクロールで上から消える）
                section.classList.add('prev');
                section.classList.remove('next', 'current');
            }
        });
        isScrolling = false; // 処理が完了したらフラグをリセット
    });
});
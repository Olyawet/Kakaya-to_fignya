class TypingAnimation {
    constructor(element, text, speed = 50) {
        this.element = element;
        this.text = text;
        this.speed = speed;
        this.currentIndex = 0;
        this.isTyping = false;
    }

    async type() {
        if (this.isTyping) return;
        
        this.isTyping = true;
        this.element.textContent = '';
        this.element.classList.add('typing');
        
        for (let i = 0; i < this.text.length; i++) {
            this.element.textContent += this.text[i];
            await this.sleep(this.speed);
        }
        
        this.element.classList.remove('typing');
        this.isTyping = false;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

class Game {
    constructor() {
        this.currentScreen = 'start';
        this.gameMode = null;
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.startScreen = document.getElementById('start-screen');
        this.questionScreen = document.getElementById('question-screen');
        this.clearQuestionScreen = document.getElementById('clear-question-screen');
        this.responseScreen = document.getElementById('response-screen');
        this.questionText = document.getElementById('question-text');
        this.clearQuestionText = document.getElementById('clear-question-text');
        this.responseText = document.getElementById('response-text');
        this.startUnclearBtn = document.getElementById('start-unclear-btn');
        this.startClearBtn = document.getElementById('start-clear-btn');
        this.restartBtn = document.getElementById('restart-btn');
        this.laughSound = document.getElementById('laugh-sound');
    }

    bindEvents() {
        this.startUnclearBtn.addEventListener('click', () => this.startUnclearGame());
        this.startClearBtn.addEventListener('click', () => this.startClearGame());
        this.restartBtn.addEventListener('click', () => this.restartGame());
        
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleAnswer(e.target.dataset.answer));
        });
    }

    async showScreen(screenId) {
        // Скрываем все экраны
        [this.startScreen, this.questionScreen, this.clearQuestionScreen, this.responseScreen].forEach(screen => {
            screen.classList.remove('active');
        });

        // Показываем нужный экран
        const targetScreen = document.getElementById(screenId);
        targetScreen.classList.add('active');
        
        // Добавляем эффект появления
        targetScreen.classList.add('fade-in');
        setTimeout(() => targetScreen.classList.remove('fade-in'), 500);
    }

    async startUnclearGame() {
        this.gameMode = 'unclear';
        this.currentScreen = 'question';
        await this.showScreen('question-screen');
        
        const typing = new TypingAnimation(this.questionText, 'Привет! Ты кто?', 80);
        await typing.type();
        
        // Добавляем эффект появления кнопок
        document.querySelectorAll('.option-btn').forEach((btn, index) => {
            setTimeout(() => {
                btn.classList.add('bounce');
                setTimeout(() => btn.classList.remove('bounce'), 600);
            }, index * 200);
        });
    }

    async startClearGame() {
        this.gameMode = 'clear';
        this.currentScreen = 'clear-question';
        await this.showScreen('clear-question-screen');
        
        const typing = new TypingAnimation(this.clearQuestionText, 'Что ты любишь пить?', 80);
        await typing.type();
        
        // Добавляем эффект появления кнопок
        document.querySelectorAll('.option-btn').forEach((btn, index) => {
            setTimeout(() => {
                btn.classList.add('bounce');
                setTimeout(() => btn.classList.remove('bounce'), 600);
            }, index * 200);
        });
    }

    async handleAnswer(answer) {
        this.currentScreen = 'response';
        await this.showScreen('response-screen');
        
        if (this.gameMode === 'unclear') {
            switch (answer) {
                case 'ded':
                    await this.handleDedAnswer();
                    break;
                case 'who':
                    await this.handleWhoAnswer();
                    break;
                case 'dunno':
                    await this.handleDunnoAnswer();
                    break;
            }
        } else if (this.gameMode === 'clear') {
            switch (answer) {
                case 'coffee':
                    await this.handleCoffeeAnswer();
                    break;
                case 'tea':
                    await this.handleTeaAnswer();
                    break;
                case 'water':
                    await this.handleWaterAnswer();
                    break;
                case 'nothing':
                    await this.handleNothingAnswer();
                    break;
            }
        }
    }

    async handleDedAnswer() {
        const responses = [
            'А я конь в пальто!',
            'Ха-ха-ха! 😂',
            'Ну ты и забавный!',
            'Может быть ты и прав...',
            'А может и нет! 😄'
        ];

        for (let i = 0; i < responses.length; i++) {
            const typing = new TypingAnimation(this.responseText, responses[i], 60);
            await typing.type();
            
            if (i === 1) {
                // Воспроизводим звук смеха
                this.playLaughSound();
                this.createParticles();
            }
            
            if (i < responses.length - 1) {
                await this.sleep(2000);
            }
        }
        
        await this.sleep(3000);
        this.showRestartButton();
    }

    async handleWhoAnswer() {
        const responses = [
            'Я незнакомец.',
            'Хотя...',
            'Я короче, иду на качели.',
            'Ой... Не знаю, как это вообще связано',
            'В общем...',
            'Я тоже дед в пехто, только ещё любитель качаться на качелях.'
        ];

        const delays = [3000, 5000, 4000, 3000, 3000, 4000];

        for (let i = 0; i < responses.length; i++) {
            const typing = new TypingAnimation(this.responseText, responses[i], 70);
            await typing.type();
            
            if (i < responses.length - 1) {
                await this.sleep(delays[i]);
            }
        }
        
        this.showRestartButton();
    }

    async handleDunnoAnswer() {
        const typing = new TypingAnimation(this.responseText, 'Вот я тоже не знаю! :(', 80);
        await typing.type();
        
        await this.sleep(3000);
        this.showRestartButton();
    }

    async handleCoffeeAnswer() {
        const responses = [
            'Кофе? Отличный выбор! ☕',
            'Знаешь, кофе - это не просто напиток...',
            'Это философия жизни!',
            'Каждый глоток - это новая история...',
            'А ты знаешь, что кофе открыли козы?',
            'Правда! Они стали танцевать после того, как съели кофейные ягоды! 🐐💃'
        ];

        for (let i = 0; i < responses.length; i++) {
            const typing = new TypingAnimation(this.responseText, responses[i], 70);
            await typing.type();
            
            // Добавляем эффект кофе
            this.responseText.classList.add('coffee-effect');
            
            if (i < responses.length - 1) {
                await this.sleep(2500);
            }
        }
        
        this.responseText.classList.remove('coffee-effect');
        await this.sleep(3000);
        this.showRestartButton();
    }

    async handleTeaAnswer() {
        const responses = [
            'Чай? Классика! 🍵',
            'Знаешь, чай бывает разный...',
            'Чёрный, зелёный, белый, улун...',
            'А ты какой любишь?',
            'Хотя... подожди...',
            'Я же не должен спрашивать! 😅',
            'Ты уже сказал - чай!'
        ];

        for (let i = 0; i < responses.length; i++) {
            const typing = new TypingAnimation(this.responseText, responses[i], 70);
            await typing.type();
            
            // Добавляем эффект чая
            this.responseText.classList.add('tea-effect');
            
            if (i < responses.length - 1) {
                await this.sleep(2000);
            }
        }
        
        this.responseText.classList.remove('tea-effect');
        await this.sleep(3000);
        this.showRestartButton();
    }

    async handleWaterAnswer() {
        const responses = [
            'Вода? Самый здоровый выбор! 💧',
            'Знаешь, вода покрывает 71% поверхности Земли...',
            'И 100% поверхности моего стола после того, как я её пролил! 😂',
            'Хотя это было давно...',
            'Теперь я пью из стакана с крышкой!',
            'Умные люди учатся на своих ошибках! 🧠'
        ];

        for (let i = 0; i < responses.length; i++) {
            const typing = new TypingAnimation(this.responseText, responses[i], 70);
            await typing.type();
            
            // Добавляем эффект воды
            this.responseText.classList.add('water-effect');
            
            if (i < responses.length - 1) {
                await this.sleep(2500);
            }
        }
        
        this.responseText.classList.remove('water-effect');
        await this.sleep(3000);
        this.showRestartButton();
    }

    async handleNothingAnswer() {
        const responses = [
            'Ничего? Интересно... 🤔',
            'Знаешь, ничего - это тоже что-то!',
            'Это как ноль - он существует, но его нет!',
            'Философский вопрос получается...',
            'А может ты просто не хочешь признаваться? 😏',
            'Или ты робот, который не пьёт жидкости? 🤖',
            'Хотя роботы тоже нуждаются в охлаждении!'
        ];

        for (let i = 0; i < responses.length; i++) {
            const typing = new TypingAnimation(this.responseText, responses[i], 70);
            await typing.type();
            
            // Добавляем эффект "ничего"
            this.responseText.classList.add('nothing-effect');
            
            if (i < responses.length - 1) {
                await this.sleep(2500);
            }
        }
        
        this.responseText.classList.remove('nothing-effect');
        await this.sleep(3000);
        this.showRestartButton();
    }

    showRestartButton() {
        this.restartBtn.style.display = 'inline-block';
        this.restartBtn.classList.add('bounce');
        setTimeout(() => this.restartBtn.classList.remove('bounce'), 600);
    }

    async restartGame() {
        this.currentScreen = 'start';
        this.gameMode = null;
        await this.showScreen('start-screen');
        this.restartBtn.style.display = 'none';
        
        // Убираем все эффекты
        this.responseText.classList.remove('coffee-effect', 'tea-effect', 'water-effect', 'nothing-effect');
    }

    playLaughSound() {
        try {
            this.laughSound.currentTime = 0;
            this.laughSound.play();
        } catch (error) {
            console.log('Не удалось воспроизвести звук');
        }
    }

    createParticles() {
        const container = document.querySelector('.content');
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                particle.style.background = `hsl(${Math.random() * 360}, 70%, 60%)`;
                container.appendChild(particle);
                
                setTimeout(() => {
                    particle.remove();
                }, 3000);
            }, i * 100);
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Инициализация игры при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new Game();
});

// Дополнительные эффекты при клике на кнопки
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn')) {
        // Создаем эффект пульсации
        e.target.style.transform = 'scale(0.95)';
        setTimeout(() => {
            e.target.style.transform = '';
        }, 150);
    }
});

// Запрет контекстного меню
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Запрет перетаскивания элементов
document.addEventListener('dragstart', (e) => {
    e.preventDefault();
});

// Добавляем случайные анимации фона
setInterval(() => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = '100%';
    particle.style.background = randomColor;
    particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
    
    document.body.appendChild(particle);
    
    setTimeout(() => {
        particle.remove();
    }, 5000);
}, 3000);

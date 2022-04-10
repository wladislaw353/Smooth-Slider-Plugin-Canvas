function SmoothSlider(options) {
    const params = {
        slider:      options.slider || '.smooth-slider',
        pieses:      options.pieses || 100,
        duration:    options.duration || 10,
        transition:  options.transition || 1,
        nav:         options.nav || '.smooth-slider_nav',
        images:      options.images || false,
        loop:        options.loop === false ? false : true
    }

    // Init
    const $slider      = document.querySelector(params.slider)
    const $nav         = document.querySelector(params.nav)
    const sliderWidth  = $slider.clientWidth
    let pieses         = params.pieses
    const sectionWidth = Math.round(sliderWidth / pieses)
    let currentSlide   = 1
    let slidesCount    = 0
    let arrowBlock     = false
 
    if (sliderWidth % pieses !== 0) {
        pieses += Math.round((sliderWidth - sectionWidth * pieses) / sectionWidth) + 1
    }
    
    // Controllers
    let iterator = 1
    function play(value) {
        const interval = setInterval(()=> {
            if(iterator <= pieses) {
                if(value == 'next' || value == 'last') {
                    $slider.querySelector(`.smt-slide:nth-child(${currentSlide}) .smt-slide-piese:nth-child(${iterator})`).style.opacity = 0
                } else {
                    $slider.querySelector(`.smt-slide:nth-child(${currentSlide}) .smt-slide-piese:nth-child(${pieses-iterator+1})`).style.opacity = 1
                }
                iterator++
            } else {
                playEnd(value)  
                clearInterval(interval);
            }
        }, params.duration)
    }

    function playEnd(value) {
            if(value == 'next') currentSlide--
            if(value == 'prev') currentSlide++
            if(value == 'last') {
                $slider.querySelector(`.smt-slide:nth-child(${currentSlide})`).style['z-index'] = 1
                for (let i = 1; i <= pieses; i++) {
                    $slider.querySelector(`.smt-slide:nth-child(${currentSlide}) .smt-slide-piese:nth-child(${i})`).style.opacity = 1
                }
                currentSlide = slidesCount
            }
            if(value == 'first') {
                $slider.querySelector(`.smt-slide:nth-child(${currentSlide})`).style['z-index'] = 1
                for (let i = 1; i <= pieses; i++) {
                    $slider.querySelector(`.smt-slide:nth-child(${currentSlide}) .smt-slide-piese:nth-child(${i})`).style.opacity = 0
                }
                currentSlide = 1
            }
            iterator = 1
            $nav.querySelector(`${params.nav}>.smt-arrow:last-child`).classList.remove('disabled')
            arrowBlock = false
    }


    // Actions
    if(!params.loop) $nav.querySelector(`${params.nav}>.smt-arrow:first-child`).classList.add('disabled')

    // Получение изображений
    let slides = []
    if (!params.images) {
        const images = $slider.querySelectorAll('img')
        images.forEach(image => {
            slides.push(image.src)
        })
    } else {
        slides = params.images
    }
    
    // Генерация слайдов
    let template = ''
    slides.forEach(slide => {
        template += '<div class="smt-slide">'
        for (let i = 0; i < pieses; i++) {
            template += `<div class="smt-slide-piese" style="left:${i*sectionWidth}px; width:${sectionWidth}px; background: url(${slide}) ${i*sectionWidth*(-1)}px center / ${sliderWidth}px 100%; transition: opacity ${params.transition}s ease"></div>`
        }
        template += '</div>'
        slidesCount++
    })
    $slider.innerHTML = template
    currentSlide = slidesCount

    // Обработка стрелок навигации
    $nav.querySelector(`${params.nav}>.smt-arrow:first-child`).addEventListener('click', ()=> {
        // prev
        if(!arrowBlock) {
            arrowBlock = true
            $nav.querySelector(`${params.nav}>.smt-arrow:last-child`).classList.remove('disabled')
            if (currentSlide < slidesCount) {
                play('prev')
            } else {
                if(params.loop) {
                    $slider.querySelector(`.smt-slide:nth-child(1)`).style['z-index'] = 2
                    for (let s = 2; s <= slidesCount; s++) {
                        for (let i = 2; i <= pieses; i++) {
                            $slider.querySelector(`.smt-slide:nth-child(${s}) .smt-slide-piese:nth-child(${i})`).style.opacity = 0
                        }
                    }
                    play('first')
                } else {
                    $nav.querySelector(`${params.nav}>.smt-arrow:first-child`).classList.add('disabled')
                }
            }
        }
    })
    $nav.querySelector(`${params.nav}>.smt-arrow:last-child`).addEventListener('click', ()=> {
        // next
        if(!arrowBlock) {
            arrowBlock = true
            $nav.querySelector(`${params.nav}>.smt-arrow:first-child`).classList.remove('disabled')
            if (currentSlide > 1) {
                play('next')
            } else {
                if(params.loop) {
                    $slider.querySelector(`.smt-slide:nth-child(${currentSlide})`).style['z-index'] = 2
                    for (let s = 1; s <= slidesCount; s++) {
                        for (let i = 1; i <= pieses; i++) {
                            $slider.querySelector(`.smt-slide:nth-child(${s}) .smt-slide-piese:nth-child(${i})`).style.opacity = 1
                        }
                    }
                    play('last')
                } else {
                    $nav.querySelector(`${params.nav}>.smt-arrow:last-child`).classList.add('disabled')
                }
            }
        }
    })
    
    // Методы
    SmoothSlider.count = ()=> {
        return slidesCount
    }
    SmoothSlider.current = ()=> {
        return currentSlide
    }
}

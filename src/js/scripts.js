const burgerBtn = document.querySelector('.burger-menu');
const showMenu = document.querySelector(".header__list-box");
const fixPosition = document.body;

burgerBtn.addEventListener('click', () => {
    showMenu.classList.toggle('header__list-box--active');
    fixPosition.classList.toggle('fixed-position');
});

/*CUSTOM SELECT*/
let select = function () {
    let selectHeader = document.querySelectorAll('.select-custom__header');
    let selectItem = document.querySelectorAll('.select-custom__item');

    selectHeader.forEach(item => {
        item.addEventListener('click', selectToggle);
    })

    selectItem.forEach(item => {
        item.addEventListener('click', selectChoose);
    })

    function selectToggle() {
        this.parentElement.classList.toggle('is-active');
    }

    function selectChoose() {
        let text = this.innerText,
            select = this.closest('.select-custom'),
            currentText = select.querySelector('.select-custom__current');
        currentText.innerText = text;
        select.classList.remove('is-active');
    }
};

select();
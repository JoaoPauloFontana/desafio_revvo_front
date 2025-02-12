function modalInit(){
    const modal = document.querySelector('.modal-container');

    if(modal){
        let closeModal = localStorage.getItem('first-modal');

        if(!closeModal) {
            modal.classList.add('modal-show')
            localStorage.setItem('first-modal', 'hidden');
        }else{
            modal.classList.remove('modal-show')
        }
    }
}

function closeModal() {
    const modal = document.querySelector('.modal-close')

    if(modal) {
        modal.addEventListener('click', function() {
            document.querySelector('.modal-container').classList.remove('modal-show')
        })
    }
}
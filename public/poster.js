class Button {
    constructor(button_type) {
        this.button_type = button_type
        this.button = this.createButton(button_type);
    }

    createButton() {
        let button = document.createElement('button');
        let buttonImage
        if (this.button_type=='save') {
            likeButton.className = ('save-button btn btn-dark');
            likeButton.onclick = this.saveMovie;
        } else if (this.button_type=='like') {
            buttonImage = this.createButtonImage('images/thumb-up.png')
            button.className = ('btn btn-dark');
            button.onclick = this.updateCount;
            this.count = 0;
        } else if (this.button_type=='dislike') {

        }
    }

    createButtonImage(src) {
        const image = document.createElement('img');
        image.src = src;
        image.className = 'button-img';
        return image;
    }

    updateCount(newCount=this.count+1) {
        this.count = newCount;
    }
}
export class Profile{
    constructor(name, job, avatar, id){
      this.userInfoFoto = document.querySelector('.user-info__photo');
      this.userName = document.querySelector('.user-info__name');
      this.userJob = document.querySelector('.user-info__job');
      this.author = id;
      this.name = name;
      this.job = job;
      this.avatar = avatar;
    }

    update(){
      this.userName.textContent = this.name;
      this.userJob.textContent = this.job;
      this.userInfoFoto.style.backgroundImage = `url(${this.avatar})`;
    }
}
import { CircleWidth, CircleColors, GridHeight } from "../Script/constant";


const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Graphics)
    graphic: cc.Graphics = null;
    // LIFE-CYCLE CALLBACKS:

    // LIFE-CYCLE CALLBACKS:
    game = null;
    data = null;

     onLoad () {

       
     }
     onClickBtn(){
         if(this.game&&this.data.circles.length > 0&&this.game.isCanOperation()){
             let cid = this.data.circles.pop();
             this.game.createCircle(cid,this);
             this.draw();
             this.game.addStep();
             this.checkCore();
         }

     }

    start () {

    }
    createCircle(){
        if(this.game&&this.data.circles.length > 0){
            let cid = this.data.circles.pop();
            this.game.createCircle(cid,this);
            this.draw();
            this.checkCore();

        }
    }
    setData(data,game){
        this.game = game;
        this.data = data;
        this.draw();
       
    }
    draw(){

        this.graphic.clear();
        this.graphic.lineWidth = CircleWidth;
              
        
        for(let i = 0; i < this.data.circles.length;i ++){

            this.graphic.strokeColor = CircleColors[this.data.circles[i]];
           
            this.graphic.circle(0,0,10*(i+1)+10);
            this.graphic.stroke();
        }

        if(this.data.coreCid >= 0){
            this.graphic.fillColor = CircleColors[this.data.coreCid];
            this.graphic.rect(-6,-6,12,12);
            this.graphic.fill();
    
        }
       
    }
    checkCore(){

        if(this.data.circles.length == 0 && this.data.coreCid >= 0){
           
            this.scheduleOnce(()=>{
                let cid = this.data.coreCid;
                this.data.coreCid = -1;
               
                this.draw();
                this.game.createCircle(cid,this);
            },1);
          
        }

    }
    update (dt) {}
}

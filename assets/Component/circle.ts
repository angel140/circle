import { CircleWidth, CircleColors } from "../Script/constant";


const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Graphics)
    graphic: cc.Graphics = null;
    // LIFE-CYCLE CALLBACKS:

    radius = 0;
    cid = 0;
    filterList = [];

    

    onLoad () {}

    setData(cid){
        this.cid = cid;

    }
    isIgnore(node){

        for(let i = 0; i < this.filterList.length; i++){
            if( node === this.filterList[i]){
                return true;
            }
        }
        return false;
    }
     update (dt) {
         

        this.graphic.clear();
        this.graphic.lineWidth = CircleWidth;
              
        this.radius = this.radius + 10;
      

            this.graphic.strokeColor = CircleColors[this.cid];
           
            this.graphic.circle(0,0,this.radius);
            this.graphic.stroke();
        

     }
    }

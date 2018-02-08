
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Label)
    levelName: cc.Label = null;

    callb = null;
    levelData = null;


    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    }
    onClickButton(){
        if(this.callb){
            this.callb(this.levelData.level);
        }

    }
    setData(data,callback){
        this.callb = callback;
        this.levelData = data;
        this.levelName.string = String(this.levelData.level);
        let str: string = cc.sys.localStorage.getItem("savekey" + String(this.levelData.level)) || null;
        if (str) {

        }

    }
    

    // update (dt) {},
}

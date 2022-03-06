import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";

export class Game extends Container
{
    private temp:Sprite;
    
    public constructor()
    {
        super();
        this.temp = Sprite.from("img/temp.png");
        this.temp.anchor.set(0.5);
        this.addChild(this.temp);
        this.temp.interactive = true;
        
        let loops = 0;
        this.temp.addListener("click", ()=>{
            createjs.Tween.get(this.temp).to({rotation: Math.PI/2*(++loops)}, 1000);
        })
    }
}
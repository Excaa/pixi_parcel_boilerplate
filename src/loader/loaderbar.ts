import { Container } from "@pixi/display";
import { Graphics } from "@pixi/graphics";

/**
 * Loader visualization.
 */
export class LoaderBar extends Container
{
    private barBg:Graphics;
    private barFill:Graphics;
    
    public constructor()
    {
        super();
        
        this.barBg = new Graphics();
        this.barBg.beginFill(0xffffff, 1);
        this.barBg.drawRect(0,0,300,50);
        this.barBg.endFill();
        this.barBg.pivot.set(150,0);
        
        this.barFill = new Graphics();
        this.barFill.beginFill(0x90ff90, 1);
        this.barFill.drawRect(0,0,300,50);
        this.barFill.endFill();
        this.barFill.pivot.set(0,0);
        this.barFill.x = -150;
        
        this.addChild(this.barBg);
        this.addChild(this.barFill);
    }
    
    public update(percent:number):void
    {
        this.barFill.scale.set(percent);
    }
}
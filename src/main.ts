import { Container } from "@pixi/display";
import { Loader } from "@pixi/loaders";
import { Ticker } from "@pixi/ticker";
import { InteractionManager } from "@pixi/interaction";
import { config } from "./config";
import { Game } from "./game/game";
import { LoaderBar } from "./loader/loaderbar";

import {AbstractRenderer, autoDetectRenderer, Renderer, BatchRenderer } from '@pixi/core';
Renderer.registerPlugin('batch', BatchRenderer);
Renderer.registerPlugin('interaction', InteractionManager);

export class Main
{
    public renderer:AbstractRenderer;
    
    private loaderBar:LoaderBar;
    private stage:Container;
    private ticker:Ticker;
    private game:Game;
    
    public constructor()
    {
        //Wait until dom is ready.
        if (document.readyState === "loading")
        {
            document.addEventListener("DOMContentLoaded", this.onDomContentReady);
        }
        else
        {
            this.onDomContentReady();
        }
    }
    
    private onDomContentReady = ()=>{
        // Prevent createjs ticker from being used by removing it completely.
        // Without this Tweenjs uses createjs ticker -> not in sync with renderer tick -> tweens not always smooth. 
        // TODO - find out better alternative or switch away from Tweenjs
        (window as any).createjs.Ticker = undefined;
        
        this.initialize();
    }
    
    private async initialize():Promise<void>
    {
        this.initializeRenderer();
        
        this.loaderBar = new LoaderBar();
        this.stage.addChild(this.loaderBar);
        this.onResize();
        
        await this.loadAssets();
        this.stage.removeChild(this.loaderBar);
        this.initializeGame();
        
        this.ticker = new Ticker();
        this.ticker.add(this.onRender);
        this.ticker.start();
    }
    
    private initializeRenderer():void
    {
        this.renderer = autoDetectRenderer({
            antialias:true,
            autoDensity:true,
            backgroundAlpha:1,
            backgroundColor: 0x000000,
            clearBeforeRender:true,
            powerPreference: "high-performance",
            preserveDrawingBuffer: false
        });
        document.body.appendChild(this.renderer.view);
        window.addEventListener("resize", ()=>this.onResize());
        
        this.stage = new Container();
    }
    
    private async loadAssets():Promise<void>
    {
        return new Promise( (resolve, reject) => {
            config.assets.forEach( asset => Loader.shared.add(asset));
            Loader.shared.onError.add( (e)=>{
                console.error("Asset load failed.");
                console.error(e);
                reject();
            })
            Loader.shared.load( ()=>resolve() );
            Loader.shared.onProgress.add( ()=>this.loaderBar.update(Loader.shared.progress));
        });
    }
    
    private initializeGame():void
    {
        this.game = new Game();
        this.stage.addChild(this.game);
        
        // Set initial size
        this.onResize();
    }
    
    private onResize():void
    {
        this.renderer.resize( window.innerWidth, window.innerHeight );
        if(this.loaderBar){
            this.loaderBar.position.set(this.renderer.screen.width/2, this.renderer.screen.height/2);
        }
        if(this.game){
            this.game.position.set(this.renderer.screen.width/2, this.renderer.screen.height/2);
        }
    }
    
    private onRender = ()=>{
        const deltaTime = this.ticker.deltaTime * config.globalSpeed;
        const deltaMs = this.ticker.deltaMS * config.globalSpeed;
        
        createjs.Tween.tick( deltaMs, false );
        
        this.renderer.render(this.stage);
    }
    
}

// Allow the Main class to be found via window for reading renderer etc.
declare global
{
    interface Window
    {
        main:Main;
    }
}

// Create the main class
window.main = new Main();
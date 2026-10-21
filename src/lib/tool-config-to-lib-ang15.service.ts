import {Inject, Injectable} from '@angular/core';
import {IConfigToLib, LIB_CONFIG} from "./config.token";

@Injectable({
    providedIn: 'root'
})
export class ToolConfigToLibAng15Service {

    constructor(@Inject(LIB_CONFIG) private cfg: IConfigToLib) {
    };

    public doSomething() {
        this.cfg.log('called');
        return this.cfg.apiUrl;
    }
}

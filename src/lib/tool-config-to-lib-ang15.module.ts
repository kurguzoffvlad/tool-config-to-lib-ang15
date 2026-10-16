import {ModuleWithProviders, NgModule} from '@angular/core';

import { ToolConfigToLibAng15RoutingModule } from './tool-config-to-lib-ang15-routing.module';
import {ToolConfigToLibAng15Component} from './tool-config-to-lib-ang15.component';
import {IConfigToLib, LIB_CONFIG} from "./config.token";


@NgModule({
    declarations: [
        ToolConfigToLibAng15Component
    ],
    imports: [ToolConfigToLibAng15RoutingModule],
    exports: [
        ToolConfigToLibAng15Component
    ]
})
export class ToolConfigToLibAng15Module {
    static forRoot(config: IConfigToLib): ModuleWithProviders<ToolConfigToLibAng15Module> {
        return {
            ngModule: ToolConfigToLibAng15Module,
            providers: [{provide: LIB_CONFIG, useValue: config}]
        };
    }
}

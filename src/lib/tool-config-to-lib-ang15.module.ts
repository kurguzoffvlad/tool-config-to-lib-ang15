import { ModuleWithProviders, NgModule } from '@angular/core';

import { IConfigToLib, LIB_CONFIG } from "./config.token";


@NgModule({
	declarations: [],
	imports: [],
	exports: []
})
export class ToolConfigToLibAng15Module {
	static forRoot(config: IConfigToLib): ModuleWithProviders<ToolConfigToLibAng15Module> {
		return {
			ngModule: ToolConfigToLibAng15Module,
			providers: [{ provide: LIB_CONFIG, useValue: config }]
		};
	}
}

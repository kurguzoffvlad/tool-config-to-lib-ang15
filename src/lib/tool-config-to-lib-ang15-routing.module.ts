// tool-config-to-lib-ang15-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ToolConfigToLibAng15Component } from './tool-config-to-lib-ang15.component';

const routes: Routes = [
    {
        path: '',
        component: ToolConfigToLibAng15Component,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ToolConfigToLibAng15RoutingModule {}

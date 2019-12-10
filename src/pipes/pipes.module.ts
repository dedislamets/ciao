import { NgModule } from '@angular/core';
import { SafeHtmlPipe } from './safe-html/safe-html';
import { KeysPipe } from './keys/keys';
import { UppercasePipe } from './uppercase/uppercase';
@NgModule({
	declarations: [SafeHtmlPipe,
    KeysPipe,
    UppercasePipe],
	imports: [],
	exports: [SafeHtmlPipe,
    KeysPipe,
    UppercasePipe]
})
export class PipesModule {}

import { NgModule } from '@angular/core';

import { FindLanguageFromKeyPipe, JhiAlertComponent, JhiAlertErrorComponent, TeamdojoSharedLibsModule } from './';
import { ImageUrlPipe } from './pipe/image-url.pipe';
import { TruncateStringPipe } from './pipe/truncate-string.pipe';
import { AchievementItemComponent } from 'app/shared/achievement';
import { TeamImageComponent } from 'app/shared/team-image/team-image.component';
import { NotificationItemComponent, NotificationMenuComponent } from 'app/shared/notification';

@NgModule({
    imports: [TeamdojoSharedLibsModule],
    declarations: [
        FindLanguageFromKeyPipe,
        JhiAlertComponent,
        JhiAlertErrorComponent,
        ImageUrlPipe,
        TruncateStringPipe,
        AchievementItemComponent,
        TeamImageComponent,
        NotificationMenuComponent,
        NotificationItemComponent
    ],
    providers: [],
    exports: [
        TeamdojoSharedLibsModule,
        FindLanguageFromKeyPipe,
        JhiAlertComponent,
        JhiAlertErrorComponent,
        ImageUrlPipe,
        TruncateStringPipe,
        AchievementItemComponent,
        TeamImageComponent,
        NotificationMenuComponent,
        NotificationItemComponent
    ]
})
export class TeamdojoSharedCommonModule {}

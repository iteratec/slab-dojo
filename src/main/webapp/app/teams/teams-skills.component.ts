import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LocalStorage, Ng2Webstorage } from 'ngx-webstorage';
import { LocalStorageService } from 'ngx-webstorage';
import { ITeam } from 'app/shared/model/team.model';
import { TeamsSkillsService } from './teams-skills.service';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { IAchievableSkill } from 'app/shared/model/achievable-skill.model';
import { ITEMS_PER_PAGE } from 'app/shared';
import { JhiAlertService, JhiParseLinks } from 'ng-jhipster';
import { TeamsSelectionService } from 'app/teams/teams-selection/teams-selection.service';
import * as moment from 'moment';

@Component({
    selector: 'jhi-teams-skills',
    templateUrl: './teams-skills.component.html',
    styleUrls: ['teams-skills.scss']
})
export class TeamsSkillsComponent implements OnInit, OnChanges {
    @Input() team: ITeam;
    skills: IAchievableSkill[];
    filters: string[];
    page: number;
    links: any;
    itemsPerPage: number;
    totalItems: number;
    checkComplete: boolean;

    constructor(
        private teamsSkillsService: TeamsSkillsService,
        private jhiAlertService: JhiAlertService,
        private parseLinks: JhiParseLinks,
        private teamsSelectionService: TeamsSelectionService,
        private storage: LocalStorageService
    ) {
        this.filters = [];
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.reset();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.team && changes.team.previousValue) {
            this.reset();
            this.ngOnInit();
        }
    }

    ngOnInit() {
        const storedFilters = this.storage.retrieve(this.team.id.toString());
        if (storedFilters) {
            this.filters = storedFilters;
        }
        this.loadAll();
    }

    reset(loadAll = false) {
        this.skills = [];
        this.page = 0;
        this.links = {
            last: 0
        };
        if (loadAll) {
            this.loadAll();
        }
    }

    loadAll() {
        this.teamsSkillsService
            .queryAchievableSkills(this.team.id, {
                page: this.page,
                size: this.itemsPerPage,
                filter: this.filters
            })
            .subscribe(
                (res: HttpResponse<IAchievableSkill[]>) => this.paginateAchievableSkills(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    loadPage(page) {
        this.page = page;
        this.loadAll();
    }

    onToggled(checked: boolean, skill: IAchievableSkill) {
        if (checked) {
            skill.achievedAt = moment();
        } else {
            skill.achievedAt = null;
        }
        this.teamsSkillsService.updateAchievableSkill(this.team.id, skill).subscribe(
            (res: HttpResponse<IAchievableSkill>) => (skill = res.body),
            (res: HttpErrorResponse) => {
                console.log(res);
            }
        );
    }

    onFilterClicked(filterName: string) {
        const index = this.filters.indexOf(filterName);
        if (index > -1) {
            this.filters.splice(index, 1);
        } else {
            this.filters.push(filterName);
        }
        this.storage.store(this.team.id.toString(), this.filters);
        this.reset(true);
    }

    isSameTeamSelected() {
        const selectedTeam = this.teamsSelectionService.selectedTeam;
        return selectedTeam && selectedTeam.id === this.team.id;
    }

    onSkillClicked(skill: IAchievableSkill) {
        console.log('clicked on', skill.title);
    }

    private paginateAchievableSkills(data: IAchievableSkill[], headers: HttpHeaders) {
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = parseInt(headers.get('X-Total-Count'), 10);
        for (let i = 0; i < data.length; i++) {
            this.skills.push(data[i]);
        }
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}

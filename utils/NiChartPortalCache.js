import { collectCohortsFromRemoteStorage } from '../utils/uploadFiles.js'

//const initial_cohorts = await collectCohortsFromRemoteStorage('cbica-nichart-inputdata');
//const initial_cohorts = JSON.parse(window.localStorage.getItem("nichart_cohorts"));

let module_0_cache = {};
let module_0_selected_cohort = "";

let models_cache = {module1: {}, module2: {}};

let module_1_cache = {};
let module_2_cache = {}; 
let module_3_cache = {};

let use_cached_module1_results = false;
let use_cached_module2_results = false;

export function modelsAreCached(category) {
    if (module_0_cache[category]) {
        return true;
    } else {
        return false;
    }

}

export function getModelsCache(category) {
    return models_cache[category];
}

export function setModelsCache(category, contents) {
    models_cache[category] = contents; 
}

export function getModule0Cohorts() {
    return module_0_cache;
}

export function setModule0Cohorts(cohorts_object) {
    window.localStorage.setItem("nichart_cohorts", JSON.stringify(cohorts_object))
    module_0_cache = cohorts_object;
}

export function getModule0SelectedCohort() {
    return module_0_selected_cohort;
}

export function setModule0SelectedCohort(selected) {
    module_0_selected_cohort = selected;
    return;
}

export function getUseModule1Results() {
    return use_cached_module1_results;
}

export function setUseModule1Results(setting) {
    use_cached_module1_results = setting;
}

export function getUseModule2Results() {
    return use_cached_module2_results;
}

export function setUseModule2Results(setting) {
    use_cached_module2_results = setting;
}

export function getModule1Cache() {
    return module_1_cache
}

export function setModule1Cache(modified) {
    module_1_cache = modified;
}

export function getModule2Cache() {
    return module_2_cache;
}

export function setModule2Cache(modified) {
    module_2_cache = modified;
}

export function getModule3Cache() {
    return module_3_cache;
}

export function setModule3Cache(modified) {
    module_3_cache = modified;
}


<template>

  <div id="app" class="h-100">
    <div class="loader" v-if="spinner.loading"></div>
    <nav class="navbar" style="background: #2a4e7e !important;">
      <div class="systemInformation">
        <span style="">{{ bgLabelConstants.DATE }}: </span><span id="clockId"  style="font-style: italic;"></span>
      </div>
    </nav>
    <header class="blog-header py-3">
      <div class="row flex-nowrap justify-content-between align-items-center">
        <div class="col-4 pt-1">
          <img src="../src/assets/images/bg2.png" height="90" width="100px"/>
        </div>
        <div class="col-4 text-center">
          <h1 style="font-weight: bold; font-size: 30px;">This is eIDAS TEST environment!</h1>
        </div>
        <div class="col-4 d-flex justify-content-end align-items-center">
          <img src="../src/assets/images/EU_only.png" height="70px" width="105px"/>
        </div>
      </div>
    </header>
    <div id="page-container" class="container">
      <div class="row h-100">
        <div class="col-2"></div>
        <form>

        </form>
        <div class="col-8">
          <form>
            <Card class="mr-10">
              <template #title> <h2> European Union member state's eID</h2> </template>
              <template #content>
                <h5>
                  To log in to eIDAS TEST please select the country of your eID and click "Continue". You will be redirected to your country's identity provider for authentication!
                </h5>
                <div class="divMarginTop10px">
                  <div class="row divMarginTop10px">
                    <div class="col-6">
                      <label>{{ bgLabelConstants.CITIZEN_COUNTRY }}:</label>
                      <Dropdown v-model="params.selectedCountry"
                                :options="countries"
                                filter optionLabel="name"
                                placeholder="Select a Country"
                                :class="{ 'p-invalid': v$.params.selectedCountry.$error }"
                                class="dropdown-custom w-full md:w-14rem">
                        <template #value="slotProps">
                          <div v-if="slotProps.value" class="flex align-items-center">
                            <img :alt="slotProps.value.label" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png" :class="`mr-2 flag flag-${slotProps.value.code.toLowerCase()}`"  />
                            <span>{{ slotProps.value.name }}</span>
                          </div>
                          <span v-else>
                    {{ slotProps.placeholder }}
                </span>
                        </template>
                        <template #option="slotProps">
                          <div class="flex align-items-center">
                            <img :alt="slotProps.option.label" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png" :class="`mr-2 flag flag-${slotProps.option.code.toLowerCase()}`" style="width: 18px" />
                            <span>{{ slotProps.option.name }}</span>
                          </div>
                        </template>
                      </Dropdown>
                      <div v-if="v$.params.selectedCountry.$error">
                        <small class="text-center text-danger" v-if="v$.params.selectedCountry.$invalid">{{bgLabelConstants.COUNTRY_ERROR_MSG }}</small>
                      </div>
                    </div>
                    <div class="col-6">
                      <label>{{ bgLabelConstants.NAME_IDENTIFIERS }}:</label>
                      <Dropdown
                          class="dropdown-custom"
                          :class="{ 'p-invalid': v$.params.nameIdentifier.$error }"
                          v-model="params.nameIdentifier"
                          :options="nameIdentifiers"
                          optionLabel="label" optionValue="value"
                          :filter="true"
                          :placeholder="bgLabelConstants.NAME_IDENTIFIERS"
                          :showClear="true">
                      </Dropdown>
                      <div v-if="v$.params.nameIdentifier.$error">
                        <small class="text-center text-danger" v-if="v$.params.nameIdentifier.$invalid">{{bgLabelConstants.NAME_IDENTIFIER_ERROR_MSG }}</small>
                      </div>
                    </div>
                  </div>
                  <div class="row divMarginTop10px">
                    <div class="col-6">
                      <label>{{ bgLabelConstants.LEVEL_OF_ASSURANCE }}:</label>
                      <Dropdown
                          class="dropdown-custom"
                          :class="{ 'p-invalid': v$.params.levelOfAssurance.$error }"
                          v-model="params.levelOfAssurance"
                          :options="levelOfAssuranceList"
                          optionLabel="label" optionValue="value"
                          :filter="true"
                          :placeholder="bgLabelConstants.LEVEL_OF_ASSURANCE"
                          :showClear="true">
                      </Dropdown>
                      <div v-if="v$.params.levelOfAssurance.$error">
                        <small class="text-center text-danger" v-if="v$.params.levelOfAssurance.$invalid">{{bgLabelConstants.LOA_ERROR_MSG }}</small>
                      </div>
                    </div>
                    <div class="col-6 justify-item-center">
                      <label>{{ bgLabelConstants.COMPARISON_OF_LOA }}:</label>
                      <input :disabled="true" v-model="params.comparisonOfLoa" type="text"
                             class="form-control" placeholder="">
                      <div v-if="v$.params.comparisonOfLoa.$error">
                        <small class="text-center text-danger" v-if="v$.params.comparisonOfLoa.$invalid">{{bgLabelConstants.COUNTRY_ERROR_MSG }}</small>
                      </div>
                    </div>
                  </div>
                  <div class="row divMarginTop10px">
                    <div class="col-6">
                      <h5>Requested core attributes</h5>
                    </div>
                    <div class="col-6">
                      <h5>Optional attributes</h5>
                    </div>

                  </div>
                  <div class="row divMarginTop10px text-lg-left">
                    <div class="col-6">
                      <div class="flex flex-wrap gap-3">
                        <div class="flex align-items-center">
                          <RadioButton :disabled="true" v-model="params.core.familyName" inputId="core1"  :value="bgLabelConstants.PERSON_CORE_FAMILY_NAME" />
                          <label for="ingredient1" class="ml-2">FamilyName</label>
                        </div>
                        <div class="flex align-items-center">
                          <RadioButton :disabled="true" v-model="params.core.firstName" inputId="core2"  :value="bgLabelConstants.PERSON_CORE_FIRST_NAME" />
                          <label for="ingredient2" class="ml-2">FirstName</label>
                        </div>
                        <div class="flex align-items-center">
                          <RadioButton :disabled="true" v-model="params.core.dateOfBirth" inputId="core3" :value="bgLabelConstants.PERSON_CORE_DATE_OF_BIRTH" />
                          <label for="ingredient3" class="ml-2">DateOfBirth</label>
                        </div>
                        <div class="flex align-items-center">
                          <RadioButton :disabled="true" v-model="params.core.personIdentifier" inputId="core4" :value="bgLabelConstants.PERSON_CORE_IDENTIFIER" />
                          <label for="ingredient5" class="ml-2">PersonIdentifier</label>
                        </div>
                      </div>
                    </div>
                    <div class="col-6">
                      <div class="flex flex-wrap gap-3">
                        <div class="flex align-items-center">
                          <Checkbox v-model="params.opt.gender" id="gender" name="op1" :value="bgLabelConstants.PERSON_OPTIONAL_GENDER" />
                          <label for="gender" class="ml-2">Gender</label>
                        </div>
                        <div class="flex align-items-center">
                          <Checkbox v-model="params.opt.birthName" id="birthName" name="opt2" :value="bgLabelConstants.PERSON_OPTIONAL_BIRTH_NAME" />
                          <label for="birthName" class="ml-2">BirthName</label>
                        </div>
                        <div class="flex align-items-center">
                          <Checkbox v-model="params.opt.placeOfBirth" id="placeOfBirth" name="opt3" :value="bgLabelConstants.PERSON_OPTIONAL_PLACE_OF_BIRTH" />
                          <label for="placeOfBirth" class="ml-2">PlaceOfBirth</label>
                        </div>
                        <div class="flex align-items-center">
                          <Checkbox v-model="params.opt.currentAddress" id="currentAddress" name="opt4" :value="bgLabelConstants.PERSON_OPTIONAL_CURRENT_ADDRESS" />
                          <label for="currentAddress" class="ml-2">CurrentAddress</label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="row divMarginTop10px">
                    <div class="col-sm-12 text-left mr-5">
                      <button type="button" class="btn btn-primary btn-lg" @click="login">{{
                          bgLabelConstants.CONTINUE_BTN
                        }}
                      </button>
                    </div>
                  </div>
                </div>
              </template>
            </Card>
          </form>

        </div>
        <div class="col-2"></div>
        <form style="display: none" ref="form" method="get">
          <input type="text" name="SPType"/>
          <input type="text" name="Country"/>
          <input type="text" name="RequesterID"/>
          <input type="text" name="Attributes"/>
          <input type="text" name="LoA"/>
        </form>
      </div>

      <modal name="errorModal" :height="0" :width="0">
        <ErrorModal :modal="this.modal"/>
      </modal>
    </div>
    <div id="footer" class="footer-copyright text-center py-3">
      <a href="https://www.is-bg.net/bg/" target="_blank">https://www.is-bg.net/bg/</a>
    </div>
  </div>

</template>

<script src="../src/scripts/app.js"></script>

<style src="../src/assets/styles/main.css"></style>

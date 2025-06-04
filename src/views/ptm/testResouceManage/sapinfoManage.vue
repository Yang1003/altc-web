<template>
  <div>
    <el-container>
      <el-main>
        <el-form
          ref="queryParams"
          size="small"
          :model="queryParams"
          label-width="100px"
          style="width: 100%"
          :inline="true"
        >
          <el-form-item :label="$t('ptmTranslation.ordernum')">
            <el-input
              v-model="queryParams.orderNo"
              :placeholder="$t('ptmTranslation.ordernum')"
            />
          </el-form-item>
          <el-form-item :label="$t('ptmTranslation.sapordernum')">
            <el-input
              v-model="queryParams.saporderno"
              :placeholder="$t('ptmTranslation.sapordernum')"
            />
          </el-form-item>
          <el-form-item :label="$t('ptmTranslation.macStart')">
            <el-input
              v-model="queryParams.mac"
              :placeholder="$t('ptmTranslation.macStart')"
            />
          </el-form-item>
          <el-form-item :label="$t('ptmTranslation.bosasn')">
            <el-input
              v-model="queryParams.bosasn"
              :placeholder="$t('ptmTranslation.bosasn')"
            />
          </el-form-item>
          <el-form-item :label="$t('ptmTranslation.tsn')">
            <el-input
              v-model="queryParams.tsn"
              :placeholder="$t('ptmTranslation.tsn')"
            />
          </el-form-item>
          <el-form-item :label="$t('ptmTranslation.fiberhomeitem')">
            <el-input
              v-model="queryParams.fiberhomeitem"
              :placeholder="$t('ptmTranslation.fiberhomeitem')"
            />
          </el-form-item>
          <el-button
            size="small"
            type="primary"
            icon="el-icon-search"
            plain
            @click="handleQuery(1)"
          >
            {{ $t("ptmTranslation.search") }}
          </el-button>
          <div style="margin-bottom: 10px">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-upload2"
              @click="handleUpload"
            >
              {{ $t("ptmTranslation.importData") }}
            </el-button>
            <!-- <el-button
              size="small"
              type="primary"
              icon="el-icon-printer"
              @click="visible = true"
            >
              {{ $t("ptmTranslation.printData") }}
            </el-button> -->
            <el-button
              v-if="showEdit"
              size="small"
              type="success"
              icon="el-icon-edit"
              @click="handleBacthModifyByOrder"
            >
              {{ $t("ptmTranslation.editBySapordernum") }}
            </el-button>
            <el-button
              size="small"
              type="warning"
              icon="el-icon-delete"
              @click="handleBacthDel"
            >
              {{ $t("ptmTranslation.deleteBatch") }}
            </el-button>
            <el-button
              v-if="showEdit"
              size="small"
              type="danger"
              icon="el-icon-delete"
              @click="handleBacthDeleteByOrder"
            >
              {{ $t("ptmTranslation.deleteBySapordernum") }}
            </el-button>
          </div>
        </el-form>
        <!-- 列表 -->
        <el-table ref="multipleTable" size="small" :data="list" border>
          <el-table-column
            align="center"
            type="selection"
            width="50"
          />
          <el-table-column align="center" type="index" width="50" fixed />
          <el-table-column
            align="center"
            prop="sapordernum"
            :label="$t('ptmTranslation.sapordernum')"
            min-width="120"
            fixed
          />
          <el-table-column
            align="center"
            prop="orderno"
            :label="$t('ptmTranslation.ordernum')"
            min-width="120"
            fixed
          />
          <el-table-column
            align="center"
            prop="mac"
            label="MAC"
            min-width="120"
            fixed
          />
          <el-table-column
            align="center"
            prop="macstart"
            :label="$t('ptmTranslation.macStart')"
            min-width="140"
          />
          <el-table-column
            align="center"
            prop="macend"
            :label="$t('ptmTranslation.macEnd')"
            min-width="140"
          />
          <el-table-column
            align="center"
            prop="tsn"
            :label="$t('ptmTranslation.tsn')"
            min-width="140"
          />
          <el-table-column align="center" prop="sn" label="SN" min-width="140" />
          <el-table-column
            align="center"
            prop="bosasn"
            :label="$t('ptmTranslation.bosasn')"
            min-width="140"
          />
          <el-table-column
            align="center"
            prop="province"
            :label="$t('ptmTranslation.province')"
            min-width="120"
          />
          <el-table-column
            align="center"
            prop="runcompany"
            :label="$t('ptmTranslation.runcompany')"
            min-width="120"
          />
          <el-table-column
            align="center"
            prop="productfactory"
            :label="$t('ptmTranslation.productfactory')"
            min-width="120"
          />
          <el-table-column
            align="center"
            prop="productfactorydetail"
            :label="$t('ptmTranslation.productfactorydetail')"
            min-width="180"
          />
          <el-table-column
            align="center"
            prop="equiptype"
            :label="$t('ptmTranslation.equiptype')"
            min-width="200"
          />
          <el-table-column
            align="center"
            prop="producttype"
            :label="$t('ptmTranslation.producttype')"
            min-width="120"
          />
          <el-table-column
            align="center"
            prop="fiberhomeitem"
            :label="$t('ptmTranslation.fiberhomeitem')"
            min-width="140"
          />
          <el-table-column
            align="center"
            prop="productno"
            :label="$t('ptmTranslation.productno')"
            min-width="120"
          />
          <el-table-column
            align="center"
            prop="gponsn"
            :label="$t('ptmTranslation.gponsn')"
            min-width="120"
          />
          <el-table-column
            align="center"
            prop="gponsn2"
            :label="$t('ptmTranslation.gponsn2')"
            min-width="120"
          />
          <el-table-column
            align="center"
            prop="jump"
            :label="$t('ptmTranslation.jump')"
            min-width="120"
          />
          <el-table-column
            align="center"
            prop="lanmac"
            :label="$t('ptmTranslation.lanmac')"
            min-width="120"
          />
          <el-table-column
            align="center"
            prop="macott"
            :label="$t('ptmTranslation.macott')"
            min-width="120"
          />
          <el-table-column
            align="center"
            prop="wifimac"
            :label="$t('ptmTranslation.wifimac')"
            min-width="120"
          />
          <el-table-column
            align="center"
            prop="serialno"
            :label="$t('ptmTranslation.serialno')"
            min-width="120"
          />
          <el-table-column
            align="center"
            prop="deviceid"
            label="DeviceID"
            min-width="120"
          />

          <el-table-column
            align="center"
            prop="wirelessname"
            :label="$t('ptmTranslation.wirelessname')"
            min-width="150"
          />
          <el-table-column
            align="center"
            prop="wirelesspassword"
            :label="$t('ptmTranslation.wirelesspassword')"
            min-width="120"
          />
          <el-table-column
            align="center"
            prop="gwirelessname58"
            :label="$t('ptmTranslation.gwirelessname58')"
            min-width="150"
          />
          <el-table-column
            align="center"
            prop="gpassword58"
            :label="$t('ptmTranslation.gpassword58')"
            min-width="120"
          />
          <el-table-column
            align="center"
            prop="dumode"
            :label="$t('ptmTranslation.dumode')"
            min-width="120"
          />
          <el-table-column
            align="center"
            prop="ssid2"
            :label="$t('ptmTranslation.ssid2')"
            min-width="120"
          />
          <el-table-column
            align="center"
            prop="ssid2key"
            :label="$t('ptmTranslation.ssid2key')"
            min-width="120"
          />
          <el-table-column
            align="center"
            prop="ssid3"
            :label="$t('ptmTranslation.ssid3')"
            min-width="120"
          />
          <el-table-column
            align="center"
            prop="ssid3key"
            :label="$t('ptmTranslation.ssid3key')"
            min-width="120"
          />

          <el-table-column
            align="center"
            prop="lanip"
            :label="$t('ptmTranslation.lanip')"
            min-width="120"
          />
          <el-table-column
            align="center"
            prop="username"
            :label="$t('ptmTranslation.username')"
            min-width="120"
          />
          <el-table-column
            align="center"
            prop="bpassword"
            :label="$t('ptmTranslation.bpassword')"
            min-width="120"
          />
          <el-table-column
            align="center"
            prop="macbr"
            :label="$t('ptmTranslation.macbr')"
            min-width="120"
          />
          <el-table-column
            align="center"
            prop="macap"
            :label="$t('ptmTranslation.macap')"
            min-width="120"
          />

          <el-table-column
            align="center"
            prop="hardwareversion"
            :label="$t('ptmTranslation.hardwareversion')"
            min-width="120"
          />
          <el-table-column
            align="center"
            prop="comiitid"
            label="CMIIT ID"
            min-width="120"
          />
          <el-table-column
            align="center"
            prop="cteicmei"
            label="CTEI/CMEI"
            min-width="120"
          />
          <el-table-column
            align="center"
            prop="sdproducttype"
            :label="$t('ptmTranslation.sdproducttype')"
            min-width="150"
          />
          <el-table-column
            align="center"
            prop="vol"
            :label="$t('ptmTranslation.vol')"
            min-width="120"
          />
          <el-table-column
            align="center"
            prop="ele"
            :label="$t('ptmTranslation.ele')"
            min-width="120"
          />

          <el-table-column
            align="center"
            prop="amid"
            label="amid"
            min-width="120"
          />
          <el-table-column
            align="center"
            prop="zqjk"
            :label="$t('ptmTranslation.zqjk')"
            min-width="120"
          />
          <el-table-column
            align="center"
            prop="hotline"
            :label="$t('ptmTranslation.hotline')"
            min-width="120"
          />
          <el-table-column
            align="center"
            prop="authkey"
            label="authkey"
            min-width="120"
          />

          <el-table-column
            align="center"
            prop="purchasepci"
            :label="$t('ptmTranslation.purchasepci')"
            min-width="120"
          />
          <el-table-column align="center" prop="iv" label="IV" min-width="120" />
          <el-table-column
            align="center"
            prop="ivmd5"
            label="IV_MD5"
            min-width="120"
          />

          <el-table-column
            align="center"
            prop="ssid4"
            :label="$t('ptmTranslation.ssid4')"
            min-width="120"
          />
          <el-table-column
            align="center"
            prop="ssid4key"
            :label="$t('ptmTranslation.ssid4key')"
            min-width="120"
          />
          <el-table-column
            align="center"
            prop="gssid25"
            :label="$t('ptmTranslation.gssid25')"
            min-width="120"
          />
          <el-table-column
            align="center"
            prop="gssid2key5"
            :label="$t('ptmTranslation.gssid2key5')"
            min-width="120"
          />
          <el-table-column
            align="center"
            prop="gssid35"
            :label="$t('ptmTranslation.gssid35')"
            min-width="120"
          />
          <el-table-column
            align="center"
            prop="gssid3key5"
            :label="$t('ptmTranslation.gssid3key5')"
            min-width="120"
          />
          <el-table-column
            align="center"
            prop="gssid45"
            :label="$t('ptmTranslation.gssid45')"
            min-width="120"
          />
          <el-table-column
            align="center"
            prop="gssid4key5"
            :label="$t('ptmTranslation.gssid4key5')"
            min-width="120"
          />
          <el-table-column
            align="center"
            prop="smartsn"
            label="smartsn"
            min-width="120"
          />
          <el-table-column
            align="center"
            prop="hardware"
            label="HARDWARE"
            min-width="120"
          />
          <el-table-column
            align="center"
            prop="ponmode"
            :label="$t('ptmTranslation.ponmode')"
            min-width="120"
          />
          <el-table-column
            align="center"
            prop="eqname"
            :label="$t('ptmTranslation.eqname')"
            min-width="150"
          />
          <el-table-column
            align="center"
            prop="throughput"
            :label="$t('ptmTranslation.throughput')"
            min-width="120"
          />
          <el-table-column
            align="center"
            prop="color"
            :label="$t('ptmTranslation.color')"
            min-width="120"
          />

          <el-table-column
            align="center"
            prop="gmtid"
            label="gmtid"
            min-width="120"
          />
          <el-table-column
            align="center"
            prop="modifiedDate"
            :label="$t('ptmTranslation.modifiedDate')"
            min-width="180"
          />
          <el-table-column
            prop="printed"
            :label="$t('ptmTranslation.printed')"
            align="center"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.printed == true">{{ $t('ptmTranslation.yes') }}</el-tag>
              <el-tag v-else type="success">{{ $t('ptmTranslation.no') }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="modifiedUserName"
            :label="$t('ptmTranslation.modifiedUserName')"
            min-width="120"
          />
          <el-table-column
            align="center"
            prop="softwareversion"
            :label="$t('ptmTranslation.softwareversion')"
            min-width="120"
          />
          <el-table-column
            align="center"
            prop="bosatype"
            label="bosatype"
            min-width="120"
          />
          <el-table-column
            align="center"
            prop="bosatype2"
            label="bosatype2"
            min-width="120"
          />
          <el-table-column
            align="center"
            prop="onlinetime"
            :label="$t('ptmTranslation.onlinetime')"
            min-width="120"
          />
          <el-table-column
            align="center"
            prop="compileTime"
            :label="$t('ptmTranslation.compileTime')"
            min-width="120"
          />
          <el-table-column label="操作" width="120" align="center" fixed="right">
            <template slot-scope="scope">
              <span>
                <el-button
                  size="small"
                  type="text"
                  @click="handleUpdate(scope.row)"
                >
                  {{ $t('table.edit') }}
                </el-button>
                <el-button
                  v-if="showDelete"
                  size="small"
                  type="text"
                  @click="deleteRow(scope.row)"
                >
                  {{ $t('table.delete') }}
                </el-button>
              </span>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :page-sizes="[10, 20, 50, 100, 500]"
          :current-page.sync="currentPage"
          @current-change="getList"
          @size-change="handleSizeChange"
        />

        <!-- 对话框(导入) -->
        <el-dialog
          v-loading.fullscreen.lock="upload.isUploading"
          :title="$t('ptmTranslation.importData')"
          :visible.sync="upload.open"
          width="400px"
          append-to-body
        >
          <el-form>
            <el-form-item label="导入类型">
              <el-select v-model="upload.type" clearable>
                <el-option
                  v-for="item in productTypeList"
                  :key="item.type"
                  :value="item.type"
                  :label="item.name"
                />
              </el-select>
            </el-form-item>
          </el-form>

          <div v-if="upload.type == 1">
            <el-button
              type="text"
              size="small"
              @click="handleDownloadTemplate(1)"
            >点击下载导入模板1</el-button>
            <el-button
              type="text"
              size="small"
              @click="handleDownloadTemplate(2)"
            >点击下载导入模板2</el-button>
            <el-button
              type="text"
              size="small"
              @click="handleDownloadTemplate(3)"
            >点击下载导入模板3</el-button>
            <el-button
              type="text"
              size="small"
              @click="handleDownloadTemplate(5)"
            >点击下载网关设备导入模板5</el-button>

            <el-upload
              ref="upload"
              :limit="1"
              accept=".xlsx,.xls"
              :auto-upload="false"
              :headers="upload.headers"
              :action="upload.url"
              :data="upload.data"
              :disabled="upload.isUploading"
              :on-change="handleFileChange"
              :on-progress="handleFileUploadProgress"
              :on-success="handleFileSuccess"
              :before-upload="handleBeforeUpload"
            >
              <el-button slot="trigger" size="small" type="primary">
                {{ $t('ptmTranslation.upload') }}
              </el-button>
              <br>
              <div slot="tip" class="el-upload__tip" style="color: red">
                {{ $t('ptmTranslation.uploadRemindInfo') }}
              </div>
            </el-upload>
          </div>

          <div slot="footer" class="dialog-footer">
            <el-button type="primary" size="small" @click="submitFileForm">
              {{ $t('table.confirm') }}
            </el-button>

            <el-button size="small" @click="cancelFileForm">{{ $t('table.cancel') }}</el-button>
          </div>
        </el-dialog>

        <!-- 对话框(根据订单号修改：输入订单号) -->
        <el-dialog
          v-loading.fullscreen.lock="modifyByOrder.isLoading"
          :title="modifyByOrder.orderInputTitle"
          :visible.sync="modifyByOrder.orderInputOpen"
          width="400px"
          :close-on-click-modal="false"
          append-to-body
          @closed="orderNoInputCancel"
        >
          <el-input
            v-model="modifyByOrder.saporderno"
            :placeholder="$t('ptmTranslation.sapordernum')"
          />
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" size="small" @click="orderNoInputConfirm">
              {{ $t('table.confirm') }}
            </el-button>
            <el-button size="small" @click="orderNoInputCancel">{{ $t('table.cancel') }}</el-button>
          </div>
        </el-dialog>

        <!-- 对话框(根据订单号删除：输入订单号) -->
        <el-dialog
          v-loading.fullscreen.lock="deleteByOrder.isLoading"
          :title="deleteByOrder.orderInputTitle"
          :visible.sync="deleteByOrder.open"
          width="400px"
          :close-on-click-modal="false"
          append-to-body
          @closed="deleteByOrderNoInputCancel"
        >
          <el-input
            v-model="deleteByOrder.saporderno"
            :placeholder="$t('ptmTranslation.sapordernum')"
          />
          <div slot="footer" class="dialog-footer">
            <el-button
              type="primary"
              size="small"
              @click="batchDeleteOrderNoInputConfirm"
            >
              {{ $t('table.confirm') }}
            </el-button>
            <el-button size="small" @click="deleteByOrderNoInputCancel">{{ $t('table.cancel') }}</el-button>
          </div>
        </el-dialog>

        <!-- 对话框(根据订单号修改) -->
        <el-dialog
          v-loading.fullscreen.lock="modifyByOrder.isLoading"
          :title="modifyByOrder.title"
          :visible.sync="modifyByOrder.open"
          width="1130px"
          :close-on-click-modal="false"
          append-to-body
          @closed="cancelUpdateByOrder"
        >
          <el-form
            ref="updateForm"
            :model="updateForm"
            label-width="140px"
            size="small"
            :inline="true"
          >
            <el-form-item label=" " prop="" class="isBacthModify">
              {{ $t("ptmTranslation.dialogRemind.currentOrder") }}:   {{ modifyByOrder.saporderno }} ;
              {{ $t("ptmTranslation.dialogRemind.totalDataCount") }}： {{ modifyByOrder.total }} ;
              <span style="color: #dc3545">
                Warning：{{ $t("ptmTranslation.dialogRemind.nochangeField") }}</span>
            </el-form-item>
            <el-form-item v-if="showEditField" :label="$t('ptmTranslation.province')" prop="province">
              <el-input
                v-model="updateForm.province"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item
              v-if="showEditField"
              :label="$t('ptmTranslation.runcompany')"
              prop="runcompany"
            >
              <el-input
                v-model="updateForm.runcompany"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item
              v-if="showEditField"
              :label="$t('ptmTranslation.productfactorydetail')"
              prop="productfactorydetail"
            >
              <el-input
                v-model="updateForm.productfactorydetail"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item
              v-if="showEditField"
              :label="$t('ptmTranslation.equiptype')"
              prop="equiptype"
            >
              <el-input
                v-model="updateForm.equiptype"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>

            <el-form-item
              v-if="showEditField"
              :label="$t('ptmTranslation.lanip')"
              prop="lanip"
            >
              <el-input
                v-model="updateForm.lanip"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item
              v-if="showEditField"
              :label="$t('ptmTranslation.username')"
              prop="username"
            >
              <el-input
                v-model="updateForm.username"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item
              v-if="showEditField"
              :label="$t('ptmTranslation.macbr')"
              prop="macbr"
            >
              <el-input
                v-model="updateForm.macbr"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item
              v-if="showEditField"
              :label="$t('ptmTranslation.hardwareversion')"
              prop="hardwareversion"
            >
              <el-input
                v-model="updateForm.hardwareversion"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item v-if="showEditField" :label="$t('ptmTranslation.eqname')" prop="eqname">
              <el-input
                v-model="updateForm.eqname"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item v-if="showEditField" :label="$t('ptmTranslation.vol')" prop="vol">
              <el-input
                v-model="updateForm.vol"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item v-if="showEditField" :label="$t('ptmTranslation.ele')" prop="ele">
              <el-input
                v-model="updateForm.ele"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item
              v-if="showEditField"
              :label="$t('ptmTranslation.sdproducttype')"
              prop="sdproducttype"
            >
              <el-input
                v-model="updateForm.sdproducttype"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item v-if="showEditField" label="CMIIT ID" prop="comiitid">
              <el-input
                v-model="updateForm.comiitid"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item v-if="showEditField" :label="$t('ptmTranslation.zqjk')" prop="zqjk">
              <el-input
                v-model="updateForm.zqjk"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item v-if="showEditField" :label="$t('ptmTranslation.hotline')" prop="hotline">
              <el-input
                v-model="updateForm.hotline"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item v-if="showEditField" label="HARDWARE" prop="hardware">
              <el-input
                v-model="updateForm.hardware"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item v-if="showEditField" :label="$t('ptmTranslation.ponmode')" prop="ponmode">
              <el-input
                v-model="updateForm.ponmode"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item v-if="showEditField" :label="$t('ptmTranslation.color')" prop="color">
              <el-input
                v-model="updateForm.color"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>

            <el-form-item :label="$t('ptmTranslation.softwareversion')" prop="softwareversion">
              <el-input
                v-model="updateForm.softwareversion"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item :label="$t('ptmTranslation.throughput')" prop="throughput">
              <el-input
                v-model="updateForm.throughput"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item label="bosatype" prop="bosatype">
              <el-input
                v-model="updateForm.bosatype"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item label="bosatype2" prop="bosatype2">
              <el-input
                v-model="updateForm.bosatype2"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item :label="$t('ptmTranslation.onlinetime')" prop="onlinetime">
              <el-date-picker
                v-model="updateForm.onlinetime"
                value-format="yyyy-MM-dd"
                type="date"
                :placeholder="$t('ptmTranslation.chooseDate')"
              />
            </el-form-item>
            <el-form-item :label="$t('ptmTranslation.compileTime')" prop="compileTime">
              <el-input v-model="updateForm.compileTime" :placeholder="$t('ptmTranslation.chooseTime')" />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button size="small" type="primary" @click="updateRowsByOrder">
              {{ $t('table.confirm') }}
            </el-button>
            <el-button size="small" @click="cancelUpdateByOrder">{{ $t('table.cancel') }}</el-button>
          </div>
        </el-dialog>

        <!-- 对话框(单个修改) -->
        <el-dialog
          v-loading.fullscreen.lock="batchModify.isLoading"
          :title="update.title"
          :visible.sync="update.open"
          width="1130px"
          :close-on-click-modal="false"
          append-to-body
          @closed="cancelUpdate"
        >
          <el-form
            ref="updateForm"
            :model="updateForm"
            label-width="140px"
            size="small"
            :inline="true"
          >
            <el-form-item
              v-if="batchModify.isBacthModify"
              label=" "
              prop=""
              class="isBacthModify"
            >
              已选数据： {{ batchModify.selectRows.length }} 条；
              <span style="color: #dc3545">
                warning：没有变动的数据不会被修改</span>
            </el-form-item>
            <el-form-item
              v-if="!batchModify.isBacthModify"
              label="MAC-START"
              prop="macstart"
            >
              <el-input
                v-model="updateForm.macstart"
                :disabled="true"
                :title="update.unsupportMsg"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item
              v-if="!batchModify.isBacthModify"
              label="MAC-END"
              prop="macend"
            >
              <el-input
                v-model="updateForm.macend"
                :disabled="true"
                :title="update.unsupportMsg"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>

            <el-form-item
              v-if="!batchModify.isBacthModify"
              :label="$t('ptmTranslation.ordernum')"
              prop="orderno"
            >
              <el-input
                v-model="updateForm.orderno"
                :disabled="true"
                :title="update.unsupportMsg"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item
              v-if="!batchModify.isBacthModify"
              :label="$t('ptmTranslation.sapordernum')"
              prop="sapordernum"
            >
              <el-input
                v-model="updateForm.sapordernum"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item :label="$t('ptmTranslation.province')" prop="province">
              <el-input
                v-model="updateForm.province"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>

            <el-form-item :label="$t('ptmTranslation.runcompany')" prop="runcompany">
              <el-input
                v-model="updateForm.runcompany"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item
              v-if="!batchModify.isBacthModify"
              :label="$t('ptmTranslation.productfactory')"
              prop="productfactory"
            >
              <el-input
                v-model="updateForm.productfactory"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item :label="$t('ptmTranslation.productfactorydetail')" prop="productfactorydetail">
              <el-input
                v-model="updateForm.productfactorydetail"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item :label="$t('ptmTranslation.equiptype')" prop="equiptype">
              <el-input
                v-model="updateForm.equiptype"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item
              v-if="!batchModify.isBacthModify"
              :label="$t('ptmTranslation.fiberhomeitem')"
              prop="fiberhomeitem"
            >
              <el-input
                v-model="updateForm.fiberhomeitem"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item
              v-if="!batchModify.isBacthModify"
              :label="$t('ptmTranslation.productno')"
              prop="productno"
            >
              <el-input
                v-model="updateForm.productno"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item
              v-if="!batchModify.isBacthModify"
              :label="$t('ptmTranslation.gponsn')"
              prop="gponsn"
            >
              <el-input
                v-model="updateForm.gponsn"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item
              v-if="!batchModify.isBacthModify"
              :label="$t('ptmTranslation.gponsn2')"
              prop="gponsn2"
            >
              <el-input
                v-model="updateForm.gponsn2"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>

            <el-form-item
              v-if="!batchModify.isBacthModify"
              :label="$t('ptmTranslation.jump')"
              prop="jump"
            >
              <el-input
                v-model="updateForm.jump"
                :disabled="true"
                :title="update.unsupportMsg"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>

            <el-form-item
              v-if="!batchModify.isBacthModify"
              :label="$t('ptmTranslation.lanmac')"
              prop="lanmac"
            >
              <el-input
                v-model="updateForm.lanmac"
                :disabled="true"
                :title="update.unsupportMsg"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item
              v-if="!batchModify.isBacthModify"
              label="MAC-OTT"
              prop="macott"
            >
              <el-input
                v-model="updateForm.macott"
                :disabled="true"
                :title="update.unsupportMsg"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item
              v-if="!batchModify.isBacthModify"
              label="MAC-aWiFi"
              prop="wifimac"
            >
              <el-input
                v-model="updateForm.wifimac"
                :disabled="true"
                :title="update.unsupportMsg"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item
              v-if="!batchModify.isBacthModify"
              :label="$t('ptmTranslation.serialno')"
              prop="serialno"
            >
              <el-input
                v-model="updateForm.serialno"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item
              v-if="!batchModify.isBacthModify"
              label="DeviceID"
              prop="deviceid"
            >
              <el-input
                v-model="updateForm.deviceid"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item
              v-if="!batchModify.isBacthModify"
              :label="$t('ptmTranslation.wirelessname')"
              prop="wirelessname"
            >
              <el-input
                v-model="updateForm.wirelessname"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item
              v-if="!batchModify.isBacthModify"
              :label="$t('ptmTranslation.wirelesspassword')"
              prop="wirelesspassword"
            >
              <el-input
                v-model="updateForm.wirelesspassword"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item
              v-if="!batchModify.isBacthModify"
              :label="$t('ptmTranslation.gwirelessname58')"
              prop="gwirelessname58"
            >
              <el-input
                v-model="updateForm.gwirelessname58"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item
              v-if="!batchModify.isBacthModify"
              :label="$t('ptmTranslation.gpassword58')"
              prop="gpassword58"
            >
              <el-input
                v-model="updateForm.gpassword58"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item
              v-if="!batchModify.isBacthModify"
              :label="$t('ptmTranslation.gpassword58')"
              prop="gpassword58"
            >
              <el-input
                v-model="updateForm.dumode"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item
              v-if="!batchModify.isBacthModify"
              :label="$t('ptmTranslation.ssid2')"
              prop="ssid2"
            >
              <el-input
                v-model="updateForm.ssid2"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item
              v-if="!batchModify.isBacthModify"
              :label="$t('ptmTranslation.ssid2key')"
              prop="ssid2key"
            >
              <el-input
                v-model="updateForm.ssid2key"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item
              v-if="!batchModify.isBacthModify"
              :label="$t('ptmTranslation.ssid3')"
              prop="ssid3"
            >
              <el-input
                v-model="updateForm.ssid3"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item
              v-if="!batchModify.isBacthModify"
              :label="$t('ptmTranslation.ssid3key')"
              prop="ssid3key"
            >
              <el-input
                v-model="updateForm.ssid3key"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>

            <el-form-item :label="$t('ptmTranslation.lanip')" prop="lanip">
              <el-input
                v-model="updateForm.lanip"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item :label="$t('ptmTranslation.username')" prop="username">
              <el-input
                v-model="updateForm.username"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item
              v-if="!batchModify.isBacthModify"
              :label="$t('ptmTranslation.bpassword')"
              prop="bpassword"
            >
              <el-input
                v-model="updateForm.bpassword"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item :label="$t('ptmTranslation.macbr')" prop="macbr">
              <el-input
                v-model="updateForm.macbr"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item
              v-if="!batchModify.isBacthModify"
              :label="$t('ptmTranslation.macap')"
              prop="macap"
            >
              <el-input
                v-model="updateForm.macap"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item :label="$t('ptmTranslation.hardwareversion')" prop="hardwareversion">
              <el-input
                v-model="updateForm.hardwareversion"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item :label="$t('ptmTranslation.softwareversion')" prop="softwareversion">
              <el-input
                v-model="updateForm.softwareversion"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item label="CMIIT ID" prop="comiitid">
              <el-input
                v-model="updateForm.comiitid"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item
              v-if="!batchModify.isBacthModify"
              label="CTEI/CMEI"
              prop="cteicmei"
            >
              <el-input
                v-model="updateForm.cteicmei"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item :label="$t('ptmTranslation.sdproducttype')" prop="sdproducttype">
              <el-input
                v-model="updateForm.sdproducttype"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>

            <el-form-item :label="$t('ptmTranslation.vol')" prop="vol">
              <el-input
                v-model="updateForm.vol"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item :label="$t('ptmTranslation.ele')" prop="ele">
              <el-input
                v-model="updateForm.ele"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item
              v-if="!batchModify.isBacthModify"
              label="AMID"
              prop="amid"
            >
              <el-input
                v-model="updateForm.amid"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item :label="$t('ptmTranslation.zqjk')" prop="zqjk">
              <el-input
                v-model="updateForm.zqjk"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item :label="$t('ptmTranslation.hotline')" prop="hotline">
              <el-input
                v-model="updateForm.hotline"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item
              v-if="!batchModify.isBacthModify"
              label="AUTHKEY"
              prop="authkey"
            >
              <el-input
                v-model="updateForm.authkey"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>

            <el-form-item
              v-if="!batchModify.isBacthModify"
              :label="$t('ptmTranslation.purchasepci')"
              prop="purchasepci"
            >
              <el-input
                v-model="updateForm.purchasepci"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item
              v-if="!batchModify.isBacthModify"
              label="IV"
              prop="iv"
            >
              <el-input v-model="updateForm.iv" :placeholder="$t('softLunch.pleaseEnter')" />
            </el-form-item>
            <el-form-item
              v-if="!batchModify.isBacthModify"
              label="IV_MD5"
              prop="ivmd5"
            >
              <el-input
                v-model="updateForm.ivmd5"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item
              v-if="!batchModify.isBacthModify"
              :label="$t('ptmTranslation.ssid4')"
              prop="ssid4"
            >
              <el-input
                v-model="updateForm.ssid4"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item
              v-if="!batchModify.isBacthModify"
              :label="$t('ptmTranslation.ssid4key')"
              prop="ssid4key"
            >
              <el-input
                v-model="updateForm.ssid4key"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item
              v-if="!batchModify.isBacthModify"
              :label="$t('ptmTranslation.gssid25')"
              prop="gssid25"
            >
              <el-input
                v-model="updateForm.gssid25"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item
              v-if="!batchModify.isBacthModify"
              :label="$t('ptmTranslation.gssid2key5')"
              prop="gssid2key5"
            >
              <el-input
                v-model="updateForm.gssid2key5"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item
              v-if="!batchModify.isBacthModify"
              :label="$t('ptmTranslation.gssid35')"
              prop="gssid35"
            >
              <el-input
                v-model="updateForm.gssid35"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item
              v-if="!batchModify.isBacthModify"
              :label="$t('ptmTranslation.gssid3key5')"
              prop="gssid3key5"
            >
              <el-input
                v-model="updateForm.gssid3key5"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item
              v-if="!batchModify.isBacthModify"
              :label="$t('ptmTranslation.gssid45')"
              prop="gssid45"
            >
              <el-input
                v-model="updateForm.gssid45"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item
              v-if="!batchModify.isBacthModify"
              :label="$t('ptmTranslation.gssid4key5')"
              prop="gssid4key5"
            >
              <el-input
                v-model="updateForm.gssid4key5"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item label="HARDWARE" prop="hardware">
              <el-input
                v-model="updateForm.hardware"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item :label="$t('ptmTranslation.ponmode')" prop="ponmode">
              <el-input
                v-model="updateForm.ponmode"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item :label="$t('ptmTranslation.eqname')" prop="eqname">
              <el-input
                v-model="updateForm.eqname"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item :label="$t('ptmTranslation.throughput')" prop="throughput">
              <el-input
                v-model="updateForm.throughput"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item :label="$t('ptmTranslation.color')" prop="color">
              <el-input
                v-model="updateForm.color"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item label="gmtid" prop="gmtid">
              <el-input
                v-model="updateForm.gmtid"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item label="bosatype" prop="bosatype">
              <el-input
                v-model="updateForm.bosatype"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item label="bosatype2" prop="bosatype2">
              <el-input
                v-model="updateForm.bosatype2"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>

            <el-form-item :label="$t('ptmTranslation.onlinetime')" prop="onlinetime">
              <el-date-picker
                v-model="updateForm.onlinetime"
                value-format="yyyy-MM-dd"
                type="date"
                :placeholder="$t('ptmTranslation.chooseDate')"
              />
            </el-form-item>

            <el-form-item :label="$t('ptmTranslation.factoryProductNo')" prop="factoryProductNo">
              <el-input
                v-model="updateForm.factoryProductNo"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item :label="$t('ptmTranslation.qrCode')" prop="qrCode">
              <el-input
                v-model="updateForm.qrCode"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item :label="$t('ptmTranslation.chipId')" prop="chipId">
              <el-input
                v-model="updateForm.chipId"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
            <el-form-item :label="$t('ptmTranslation.compileTime')" prop="compileTime">
              <el-input
                v-model="updateForm.compileTime"
                :placeholder="$t('softLunch.pleaseEnter')"
              />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button size="small" type="primary" @click="updateRows">
              {{ $t('table.confirm') }}
            </el-button>
            <el-button size="small" @click="cancelUpdate">{{ $t('table.cancel') }}</el-button>
          </div>
        </el-dialog>

        <el-dialog
          title="打印标签"
          :visible.sync="visible"
          width="900px"
          append-to-body
          @close="cancelPrint"
        >
          <el-form
            v-loading.fullscreen.lock="loading"
            size="small"
            label-width="60px"
            :inline="true"
          >
            <el-form-item :label="$t('ptmTranslation.ordernum')" label-width="120px">
              <el-input v-model="orderNo" :placeholder="$t('ptmTranslation.ordernum')" />
            </el-form-item>
            <el-button
              icon="el-icon-printer"
              type="primary"
              size="small"
              style="margin: 0 auto"
              @click="printLabel"
            >{{ $t("ptmTranslation.printData") }}
            </el-button>
          </el-form>
          <div class="messageClass">
            <p v-for="(item, index) in connectMsg" :key="index">
              <span v-if="item.indexOf('成功') > -1" style="color: #67c23a">{{
                item
              }}</span>
              <span
                v-else-if="item.indexOf('失败') > -1"
                style="color: #f56c6c"
              >{{ item }}</span>
              <span v-else>{{ item }}</span>
            </p>
          </div>
        </el-dialog>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { pageList } from '@/api/board/boardSapinfo'
import { updateSapinfo } from '@/api/board/boardSapinfo'
import { batchDelete } from '@/api/board/boardSapinfo'
import { getImportExcelResult } from '@/api/board/boardSapinfo'
import { getSapinfoByOrdernum } from '@/api/board/boardSapinfo'
import { queryDeleteDataByOrdernum } from '@/api/board/boardSapinfo'
import { updateByOrder } from '@/api/board/boardSapinfo'
import { deleteBySapOrderNum } from '@/api/board/boardSapinfo'

import axios from 'axios'

const APP_URL = process.env.VUE_APP_BASE_API

const HEADER = {
  headers: {
    'Access-Control-Allow-Credentials': true,
    withCredentials: false
  }
}

export default {
  data() {
    return {
      loading: false,
      showEdit: true,
      showDelete: false,
      showEditField: false,
      orderNo: null,
      macList: [],
      connectMsg: [],
      visible: false,
      list: [],
      showSearch: true,
      // 总条数
      total: 0,
      // 当前页
      currentPage: 1,
      // 定时器名称
      timer: null,
      // uploadUrl: "/testResources/board/sapinfo/importExcel",
      // 用户导入参数
      upload: {
        open: false, // 是否显示弹出层
        type: 1,
        title: '', // 弹出层标题
        isUploading: false, // 是否禁用上传
        url: APP_URL + '/testResources/board/sapinfo/importExcel',
        headers: { ...HEADER.headers }, // 设置上传的请求头部 Authorization: 'Bearer ',
        data: {} // 上传的额外数据，用于文件名
      },
      productTypeList: [
        {
          type: 1,
          name: '终端'
        }
        // {
        //   type: 2,
        //   name: 'HPLC双模通信单元'
        // },
        // {
        //   type: 3,
        //   name: 'SCU台区智能终端'
        // }
      ],
      // 批量编辑
      batchModify: {
        isLoading: false,
        isBacthModify: false,
        title: '批量编辑', // 弹出层标题
        selectRows: [] // 选中的行数据
      },
      modifyByOrder: {
        open: false, // 是否显示弹出层
        title: this.$t('ptmTranslation.editBySapordernum'), // 弹出层标题
        isLoading: false, // 是否禁用上传
        orderInputOpen: false,
        orderInputTitle: 'please inter sapordernum',
        saporderno: '',
        total: 0,
        url: APP_URL + '/testResources/board/sapinfo/updateByOrder' // 请求地址
      },
      deleteByOrder: {
        open: false, // 是否显示弹出层
        title: '根据订单号批量删除', // 弹出层标题
        isLoading: false, // 是否禁用上传
        orderInputOpen: false,
        orderInputTitle: 'please inter sapordernum',
        saporderno: '',
        total: 0,
        url: APP_URL + '/testResources/board/sapinfo/deleteBySapOrderNum' // 请求地址
      },
      // 用户修改参数
      update: {
        selectRow: {}, // 选中的行数据
        open: false, // 是否显示弹出层
        title: '编辑', // 弹出层标题
        unsupportMsg: 'MAC相关字段不允许编辑',
        url: APP_URL + '/testResources/board/sapinfo/updateByMap', // 请求地址
        rules: {}
      },
      // 更新表单
      updateForm: {
        mac: '',
        macstart: '',
        macend: '',
        orderno: '',
        sapordernum: '',
        province: '',
        runcompany: '',
        productfactory: '',
        productfactorydetail: '',
        equiptype: '',
        fiberhomeitem: '',
        productno: '',
        gponsn: '',
        gponsn2: '',
        jump: '',
        lanmac: '',
        macott: '',
        wifimac: '',
        serialno: '',
        deviceid: '',
        wirelessname: '',
        wirelesspassword: '',
        gwirelessname58: '',
        gpassword58: '',
        dumode: '',
        ssid2: '',
        ssid2key: '',
        ssid3: '',
        ssid3key: '',
        lanip: '',
        username: '',
        bpassword: '',
        macbr: '',
        macap: '',
        hardwareversion: '',
        softwareversion: '',
        comiitid: '',
        cteicmei: '',
        sdproducttype: '',
        vol: '',
        ele: '',
        amid: '',
        zqjk: '',
        hotline: '',
        authkey: '',
        purchasepci: '',
        iv: '',
        ivmd5: '',
        ssid4: '',
        ssid4key: '',
        gssid25: '',
        gssid2key5: '',
        gssid35: '',
        gssid3key5: '',
        gssid45: '',
        gssid4key5: '',
        hardware: '',
        ponmode: '',
        eqname: '',
        bosatype: '',
        bosatype2: '',
        gmtid: '',
        throughput: '',
        color: '',
        onlinetime: '',
        factoryProductNo: '',
        chipId: '',
        qrCode: '',
        compileTime: ''
      },
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        bosasn: undefined,
        fiberhomeitem: undefined,
        mac: undefined,
        orderNo: undefined,
        saporderno: undefined,
        tsn: undefined
      },
      modifyProperties: {
        pageIndex: 1,
        pageSize: 10,
        bosasn: undefined,
        fiberhomeitem: undefined,
        mac: undefined,
        orderNo: undefined,
        saporderno: undefined,
        tsn: undefined
      }
    }
  },
  // 生命周期 - 创建完成（访问当前this实例）
  async created() {},
  // 生命周期 - 挂载完成（访问DOM元素）
  mounted() {
    this.init()
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer) // 关闭
    }
  },
  methods: {
    // async getListtttt() {
    //   const { res } = await fetchList(this.listQuery);
    //   this.list = res.data;
    // },

    async init() {
      await this.getList(1)
      await this.createWebSocket()
      await this.judgeRole()
    },

    printMsg(msg) {
      if (this.connectMsg.length > 5) {
        this.connectMsg.shift()
      }
      this.connectMsg.push(msg)
    },

    createWebSocket() {
      if (typeof WebSocket === 'undefined') {
        this.printMsg('您的浏览器不支持WebSocket')
      } else {
        try {
          this.printMsg('开始连接客户端 。。。')
          this.websocket = new WebSocket('ws://localhost:7181/')
          this.initWebSocket()
        } catch (e) {
          this.printMsg('连接客户端失败！')
          this.reConnect()
        }
      }
    },

    initWebSocket() {
      // 建立连接
      this.websocket.onopen = () => {
        const url = APP_URL + '/software/getPtmClientServerVersion'
        this.$http.get(url, null, null, HEADER).then((res) => {
          if (res.code === '200') {
            this.websocket.send(
              'open,' +
                res.data.version +
                ',' +
                res.data.url +
                ',' +
                res.data.token
            )
          }
        })
      }

      // 客户端接收服务端返回的数据
      this.websocket.onmessage = (evt) => {
        this.messageFallback(evt)
      }

      // 发生错误时
      this.websocket.onerror = (evt) => {
        this.printMsg('连接客户端异常！')
        this.isConnect = false
        this.reConnect()
      }

      // 关闭连接
      this.websocket.onclose = (evt) => {
        this.printMsg('关闭客户端！')
        this.isConnect = false
      }
    },

    reConnect() {
      this.printMsg('重新连接客户端 。。。')
      // 如果已经连上就不在重连了
      if (this.isConnect) return
      this.reConnectObj && clearTimeout(this.reConnectObj)
      // 延迟3秒重连 避免过多次过频繁请求重连
      this.reConnectObj = setTimeout(function () {
        this.createWebSocket()
      }, 3000)
    },

    sendMessage(data) {
      if (this.websocket) {
        this.websocket.send(data)
      } else {
        this.reConnect()
      }
    },

    messageFallback(e) {
      const arr = e.data.split(',')
      const type = arr[0]
      const status = arr[1]
      const content = arr[2]
      if (type === '-1') {
        // 判断本地客户端是否最新版本
        if (status === 'success') {
          this.printMsg('连接客户端成功')
          this.isConnect = true
        } else if (status === 'fail') {
          this.printMsg(
            '连接客户端失败，本地客户端不是最新版本，请重新下载安装客户端'
          )
          this.isConnect = false
        }
      } else if (type === '5') {
        if (status === 'success') {
          this.updatePrintStatus()
          this.printMsg('mac地址打印成')
        } else {
          this.printMsg('mac地址打印失败：' + content)
        }
      }
    },

    // judgeRole() {
    //   // 判断当前登录用户权限
    //   debugger
    //   var loginUser = this.currLoginUser
    //   this.userid = parseInt(loginUser.userid)

    //   // 判断用户角色
    //   var userRole = loginUser.authorities
    //   if (
    //     userRole.includes('ROLE_ptmAdmin') ||
    //     userRole.includes('ROLE_boardPP')
    //   ) {
    //     this.showEdit = true
    //     this.showDelete = true
    //     this.showEditField = true
    //   } else if (userRole.includes('ROLE_classLeader')) {
    //     this.showEdit = true
    //     this.showDelete = false
    //     this.showEditField = false
    //   } else {
    //     this.showEdit = false
    //     this.showDelete = false
    //     this.showEditField = false
    //   }
    // },

    printLabel() {
      if (this.orderNo.length >= 12) {
        this.$message.error('订单号长度不正确')
        return
      }
      this.sendMessage(
        114 +
          '&' +
          this.orderNo +
          ';' +
          location.origin +
          APP_URL +
          '/testResources/board/sapinfo/getBePrintedMac?orderNo=0000' +
          this.orderNo +
          ';' +
          'Bearer ' +
          sessionStorage.getItem('_token')
      )
    },

    cancelPrint() {
      this.macList = []
      this.orderNo = null
    },

    updatePrintStatus() {
      debugger
      const api =
        '/testResources/board/sapinfo/updatePrintStatus?orderNo=0000' +
        this.orderNo
      return this.$http.get(APP_URL + api, null, null, HEADER).then((res) => {
        if (res.code === '200') {
          if (res.data != null && res.data) {
            this.$message.success('打印成功！')
          }
        }
      })
    },

    handleUpload() {
      this.upload.open = true
    },
    /** 处理上传的文件发生变化 */
    handleFileChange(file, fileList) {
      console.log('处理上传的文件发生变化')
    },
    /** 处理文件上传中 */
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true // 禁止修改
    },
    /** 发起文件上传 */
    submitFileForm() {
      if (this.upload.type === 1) {
        this.$refs.upload.submit()
      }
    },

    cancelFileForm() {
      this.upload.open = false
      this.$refs.upload.clearFiles()
    },
    /** 文件上传成功处理 */
    handleFileSuccess(response, file, fileList) {
      // 清理
      if (response.code === '200') {
        if (response.data != null) {
          const batchNum = response.data.batchNum
          this.getImportExcelResult(batchNum)
          if (this.upload.isUploading) {
            this.timer = setInterval(() => {
              this.getImportExcelResult(batchNum)
            }, 3000)
          }
        } else {
          this.upload.open = true
          this.$message.error(response.msg.join('，'))
          this.$refs.upload.clearFiles()
          this.upload.isUploading = false
          this.upload2.isUploading = false
        }
      } else {
        this.upload.open = true
        this.$message.error(response.msg.join('，'))
        this.$refs.upload.clearFiles()
        this.upload.isUploading = false
        this.upload2.isUploading = false
      }
    },
    getImportExcelResult(batchNum) {
      console.log(batchNum)
      const parm = {
        batchNum: batchNum
      }
      getImportExcelResult(parm).then((res) => {
        if (res.code === '200') {
          if (res.data != null && res.data !== '') {
            if (this.timer) {
              clearInterval(this.timer)
            }
            this.upload.open = false
            this.getList(1)
            // this.$message.success(res.data)
            this.$message({
              duration: 10,
              type: 'success',
              message: res.data,
              showClose: true
            })
            this.$refs.upload.clearFiles()
            this.upload.isUploading = false
          }
        }
      })
    },
    handleBeforeUpload(file) {
      console.log(file)
      const isXLS = file.name.toLocaleLowerCase().includes('.xls')
      if (!isXLS) {
        this.$message.error('导入附件只能是 xlsx,xls 格式!')
      }
      return isXLS
    },
    handleDownloadTemplate(type) {
      const api = APP_URL + '/testResources/board/sapinfo/exportSampleExcel'
      const params = {
        type: type
      }

      axios.post(api, { ...params }, { responseType: 'blob' }).then((res) => {
        const blob = new Blob([res.data])
        const fileName = '生产信息导入模板' + type + '.xls'
        const src = window.URL.createObjectURL(blob)
        if (src) {
          const link = document.createElement('a')
          link.style.display = 'none'
          link.href = src
          link.setAttribute('download', decodeURI(decodeURI(fileName)))
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link) // 下载完成移除元素
          window.URL.revokeObjectURL(src) // 释放掉blob对象
        }
      })
    },

    /** 查询列表 */
    getList(pageIndex) {
      for (const k in this.queryParams) {
        const e = this.queryParams[k]
        if (!e) {
          this.queryParams[k] = undefined
        }
      }
      this.queryParams.pageIndex = pageIndex
      pageList(this.queryParams).then((res) => {
        if (res.code === '200') {
          if (res.data != null) {
            this.list = res.data
            this.total = res.total
          }
        } else {
          this.$message.error(res.msg.join('，'))
        }
      })
    },
    /** 搜索按钮操作 */
    handleQuery(index) {
      this.queryParams.pageIndex = 1
      this.getList(index)
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.update.selectRow = row
      for (const k in row) {
        this.updateForm[k] = row[k]
      }

      this.update.open = true
      this.update.title = '编辑'
    },
    resetUpdateData() {
      // 表格重置
      // this.$refs.updateForm.resetFields();
      for (const k in this.updateForm) {
        this.updateForm[k] = ''
      }
      // 数据重置
      this.update.selectRow = {}
      this.update.open = false
      this.update.title = '编辑'
      // 批量编辑
      this.batchModify.selectRows = []
      this.batchModify.isBacthModify = false
      this.batchModify.isLoading = false
    },
    /** 取消修改 */
    cancelUpdate() {
      this.resetUpdateData()
    },
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.queryParams.pageIndex = 1
      this.currentPage = 1
      this.getList(1)
    },
    handleBacthModify() {
      const rows = this.$refs.multipleTable.selection
      if (rows.length === 0) {
        this.$message.error('请勾选需要编辑的数据!')
        return
      }
      const firstRow = rows[0]
      for (let i = 0; i < rows.length; i++) {
        if (firstRow.sapordernum !== rows[i].sapordernum) {
          this.$message.error('请选择相同的放号订单进行批量编辑!')
          return
        }
      }
      this.$nextTick(() => {
        for (const k in firstRow) {
          this.updateForm[k] = firstRow[k]
        }
      })

      this.update.title = '批量编辑'
      this.update.open = true
      this.update.selectRow = firstRow
      this.batchModify.selectRows = rows
      this.batchModify.isBacthModify = true
    },
    resetQueryParams() {
      for (const k in this.queryParams) {
        this.queryParams[k] = ''
      }
      this.queryParams.pageIndex = 1
      this.queryParams.pageSize = 10
    },
    handleBacthDeleteByOrder() {
      this.deleteByOrder.open = true
    },
    /** 根据订单号批量编辑 */
    batchDeleteOrderNoInputConfirm() {
      if (
        this.deleteByOrder.saporderno == null ||
        this.deleteByOrder.saporderno === ''
      ) {
        this.$message.warning('please inter sapordernum！')
        return
      }
      this.deleteByOrder.isLoading = true
      this.queryDeleteDataByOrder()
    },
    /** 查询待删除的数据 */
    queryDeleteDataByOrder() {
      // const api =
      //   '/testResources/board/sapinfo/queryDeleteDataByOrder/' +

      queryDeleteDataByOrdernum(this.deleteByOrder.saporderno).then((res) => {
        this.deleteByOrder.isLoading = false
        if (res.code === '200' && res.data != null) {
          if (res.data.totalNum === 0) {
            this.$message.warning(
              '该订单关联数据为空，请检查放号订单是否正确！'
            )
            return
          }
          // else if (res.data.modifyNum > 0) {
          //   this.$message.warning(
          //     '该订单共计 ' +
          //       res.data.totalNum +
          //       ' 条数据，其中有 ' +
          //       res.data.modifyNum +
          //       ' 条已绑定订单号，不能批量删除！'
          //   )
          //   return
          // }
          this.$confirm(
            '当前批量删除放号订单为 ' +
              this.deleteByOrder.saporderno +
              ' 的共计 ' +
              res.data.totalNum +
              ' 条数据，请确认是否继续?',
            'warning',
            {
              confirmButtonText: this.$t('table.comfirm'),
              cancelButtonText: this.$t('table.cancel'),
              type: 'warning'
            }
          )
            .then(() => {
              this.deleteByOrderHttp()
            })
            .catch(() => {
              this.$message({ type: 'info', message: '已取消' })
              this.deleteByOrderNoInputCancel()
            })
        } else {
          this.$message.error(res.msg.join('，'))
        }
      })
    },
    deleteByOrderHttp() {
      this.deleteByOrder.isLoading = true
      // const url =
      //   this.deleteByOrder.url +
      //   '?sapOrderNum=' +
      // this.$http.post(url, null, null, HEADER)
      deleteBySapOrderNum(this.deleteByOrder.saporderno)
        .then((res) => {
          this.deleteByOrder.isLoading = false
          if (res.code === '200') {
            this.$message.success('删除成功！')
            this.deleteByOrderSuccess()
          } else {
            this.$message.error(res.msg.join('，'))
          }
        })
    },
    deleteByOrderSuccess() {
      this.deleteByOrder.open = false
      this.deleteByOrder.isLoading = false
      this.resetQueryParams()
      this.getList(1)
      this.deleteByOrder.saporderno = ''
    },
    deleteByOrderNoInputCancel() {
      this.deleteByOrder.open = false
      this.deleteByOrder.open = false
      this.deleteByOrder.isLoading = false
      this.deleteByOrder.saporderno = ''
    },
    /** 根据订单号批量编辑 */
    handleBacthModifyByOrder() {
      this.modifyByOrder.orderInputOpen = true
    },
    orderNoInputConfirm() {
      if (
        this.modifyByOrder.saporderno == null ||
        this.modifyByOrder.saporderno === ''
      ) {
        this.$message.warning('please input sapordernum！')
        return
      }
      this.modifyByOrder.isLoading = true
      this.queryByOrder()
    },
    orderNoInputCancel() {
      this.modifyByOrder.orderInputOpen = false
    },
    /** 查询列表 */
    queryByOrder() {
      // const api =
      //   '/testResources/board/sapinfo/getModifyDataBySapOrderNo/' +

      getSapinfoByOrdernum(this.modifyByOrder.saporderno)
        .then((res) => {
          this.modifyByOrder.isLoading = false
          if (res.code === '200' && res.data != null) {
            if (res.data.totalNum === 0) {
              this.$message.warning(
                'Sapinfo Data is empty，please check sapordernum！'
              )
              return
            }
            this.update.selectRow = res.data.sapinfo
            this.modifyByOrder.total = res.data.totalNum
            this.showBatchModifyByOrderDialog()
          } else {
            this.$message.error(res.msg.join('，'))
          }
        })
    },
    showBatchModifyByOrderDialog() {
      this.modifyByOrder.orderInputOpen = false
      this.modifyByOrder.open = true
      this.$nextTick(() => {
        for (const k in this.updateForm) {
          this.updateForm[k] = this.update.selectRow[k]
        }
      })
    },
    cancelUpdateByOrder() {
      this.modifyByOrder.open = false
      this.modifyByOrder.isLoading = false
      // 数据重置
      for (const k in this.updateForm) {
        this.updateForm[k] = ''
      }
      this.modifyByOrder.total = 0
      this.update.selectRow = {}
      this.modifyByOrder.saporderno = ''
    },

    modifyByOrderSuccess() {
      this.modifyByOrder.open = false
      this.modifyByOrder.isLoading = false
      // 数据重置
      for (const k in this.updateForm) {
        this.updateForm[k] = ''
      }
      this.modifyByOrder.total = 0
      this.update.selectRow = {}
      this.resetQueryParams()
      this.queryParams.saporderno = this.modifyByOrder.saporderno
      this.getList(1)
      this.modifyByOrder.saporderno = ''
    },
    updateRowsByOrder() {
      let needUpdate = false
      const updateMap = {}
      for (const k in this.updateForm) {
        if (this.updateForm[k] !== this.update.selectRow[k]) {
          if (!needUpdate) {
            needUpdate = true
          }
          updateMap[k] = this.updateForm[k]
        }
      }
      if (!needUpdate) {
        this.$message({
          type: 'warning',
          message: 'no data changes！'
        })
        return
      }
      this.$confirm(
        'Current modification ordernum :  ' +
          this.modifyByOrder.saporderno +
          ' , total number:  ' +
          this.modifyByOrder.total +
          ' ，are you sure you want to continue?',
        'warning',
        {
          confirmButtonText: this.$t('table.confirm'),
          cancelButtonText: this.$t('table.cancel'),
          type: 'warning'
        }
      )
        .then(() => {
          const params = {
            saporderno: this.modifyByOrder.saporderno,
            updateMap: updateMap
          }
          this.modifyByOrderHttp(params)
        })
        .catch(() => {
          this.$message({ type: 'info', message: '已取消' })
        })
    },
    modifyByOrderHttp(params) {
      this.modifyByOrder.isLoading = true

      updateByOrder(params)
      // this.$http
      //   .post(this.modifyByOrder.url, { ...params }, null, HEADER)
        .then((res) => {
          this.modifyByOrder.isLoading = false
          if (res.code === '200') {
            this.$message.success('编辑成功，后台正在处理，请稍后刷新查看！')
            this.modifyByOrderSuccess()
          } else {
            this.$message.error(res.msg.join('，'))
          }
        })
    },
    handleBacthDel() {
      const rows = this.$refs.multipleTable.selection
      if (rows.length === 0) {
        this.$message.error('please select row date for deletion !')
        return
      }
      this.$confirm(
        rows.length + ' selected rows of table data in total，are you sure you want to delete?',
        'warning',
        {
          confirmButtonText: this.$t('table.confirm'),
          cancelButtonText: this.$t('table.cancel'),
          type: 'warning'
        }
      )
        .then(() => {
          const ids = []
          rows.forEach((item, index) => {
            ids[index] = item.id
          })
          batchDelete(ids).then((res) => {
            if (res.code === '200') {
              this.$message.success('batch delete success！')
              this.getList(this.queryParams.pageIndex)
            } else {
              this.$message.error(res.msg.join('，'))
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: 'cancel delete'
          })
        })
    },
    /** 更新列表数据 */
    updateRows() {
      let needUpdate = false
      const updateMap = {}
      for (const k in this.updateForm) {
        if (this.updateForm[k] !== this.update.selectRow[k]) {
          if (!needUpdate) {
            needUpdate = true
          }
          updateMap[k] = this.updateForm[k]
        }
      }
      if (!needUpdate) {
        this.$message({
          type: 'warning',
          message: 'no data changes！'
        })
        return
      }
      const ids = []
      if (this.batchModify.isBacthModify) {
        this.batchModify.selectRows.forEach((item, index) => {
          ids[index] = item.id
        })
      } else {
        ids[0] = this.update.selectRow.id
      }
      const params = {
        ids: ids,
        updateMap: updateMap
      }
      updateSapinfo({ ...params })
        .then((res) => {
          if (res.code === '200') {
            this.$message.success('edit success ！')
            this.resetUpdateData()
            this.getList(this.queryParams.pageIndex)
          } else {
            this.$message.error(res.msg.join('，'))
          }
        })
    },

    deleteRow(row) {
      this.$confirm('are you sure to delete this row?', 'warning', {
        confirmButtonText: this.$t('table.confirm'),
        cancelButtonText: this.$t('table.cancel'),
        type: 'warning'
      })
        .then(() => {
          const api = '/testResources/board/sapinfo/delete?id=' + row.id
          return this.$http
            .get(APP_URL + api, null, null, HEADER)
            .then((res) => {
              if (res.code === '200') {
                if (res.data != null) {
                  this.$message.success('删除成功！')
                  this.getList(1)
                }
              } else {
                this.$message.error(res.msg.join('，'))
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style scoped>
.el-select {
  display: inline-block;
  position: relative;
  width: 179px;
}

.el-input-number {
  width: 179px;
}

.el-dialog {
  width: 750px;
}

.isBacthModify {
  width: 100%;
  color: #11c26d !important;
  font-size: 16px !important;
  font-weight: 600 !important;
}
</style>

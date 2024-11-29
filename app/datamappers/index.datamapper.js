import client from '../config/config.client.js';
import CouponDataMapper from './coupon.datamapper.js';
import UserDataMapper from './user.datamapper.js';
import UploadDatamapper from './upload.datamapper.js';
import ReportDataMapper from './report.datamapper.js';
import ExportDataMapper from './export.datamapper.js';

// Initialize the datamappers
CouponDataMapper.init({ client });
UserDataMapper.init({ client });
UploadDatamapper.init({ client });
ReportDataMapper.init({ client });
ExportDataMapper.init({ client });

export {
  UserDataMapper,
  CouponDataMapper,
  UploadDatamapper,
  ReportDataMapper,
  ExportDataMapper,
};

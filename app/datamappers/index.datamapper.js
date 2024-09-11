import client from '../config/config.client.js';
import CouponDataMapper from './coupon.datamapper.js';
import UserDataMapper from './user.datamapper.js';
import UploadDatamapper from './upload.datamapper.js';

CouponDataMapper.init({ client });
UserDataMapper.init({ client });
UploadDatamapper.init({ client });

export { UserDataMapper, CouponDataMapper, UploadDatamapper };

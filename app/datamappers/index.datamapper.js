import client from '../config/config.client.js';
import CouponDataMapper from './coupon.datamapper.js';
import UserDataMapper from './user.datamapper.js';

CouponDataMapper.init({ client });
UserDataMapper.init({ client });

export { UserDataMapper, CouponDataMapper };

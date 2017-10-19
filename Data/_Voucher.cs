using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Model;

namespace Data
{
    public class _Voucher:DbCenter
    {

        public int GetVoucherCount(int uid, int srcUid)
        {
            int OrderNum = 0;
            string sql = "select count(id) as t from t_voucher where uId = " + uid;
            try
            {
                OrderNum = Convert.ToInt16(helper.GetOne(sql));
            }
            catch
            {
                OrderNum = 0;
            }
            return OrderNum;
        }

        /// <summary>
        /// 获取代金券列表
        /// </summary>
        /// <param name="uid"></param>
        /// <param name="orderNo"></param>
        /// <param name="enable"></param>
        /// <returns></returns>
        public List<voucher> GetVoucherList(int uid, string orderNo, int enable, string voucherNo)
        {
            List<voucher> lv = new List<voucher>();
            string sql = "select * from t_voucher where uId = " + uid + " order by endOn asc,enable asc";
            if (orderNo.Length > 0)
            {
                sql = "select * from t_voucher where orderNo = '" + orderNo + "' order by endOn asc,enable asc";
            }
            if (enable > -1)
            {
                sql = "select * from t_voucher where uId = " + uid + " and enable = " + enable + " order by endOn asc,enable asc";
                if (orderNo.Length > 0)
                {
                    sql = "select * from t_voucher where orderNo = '" + orderNo + "' and enable = " + enable + " order by endOn asc,enable asc";
                }
            }
            if (voucherNo.Length > 0)
            {
                sql = "select * from t_voucher where voucherNo = '" + voucherNo + "' order by endOn asc,enable asc";
            }

            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        foreach (DataRow r in dt.Rows)
                        {
                            voucher v = new voucher
                            {
                                id = Convert.ToInt32(r["id"]),
                                voucherFee = Convert.ToInt16(r["voucherFee"]),
                                voucherNo = r["voucherNo"].ToString(),
                                voucherTitle = r["voucherTitle"].ToString(),
                                addOn = Convert.ToDateTime(r["addOn"]),
                                endOn = Convert.ToDateTime(r["endOn"]),
                                enable = Convert.ToInt16(r["enable"]),
                                voucherType = Convert.ToInt16(r["voucherType"]),
                                orderNo = r["orderNo"].ToString(),
                                uid = Convert.ToInt32(r["uid"]),
                                srcUid = Convert.ToInt32(r["srcUid"]),
                                cardId = r["cardId"].ToString()
                            };
                            if (v.enable == 1)
                            {
                                v.useOn = Convert.ToDateTime(r["useOn"]);
                                v.useFee = Convert.ToDouble(r["useFee"]);
                            }
                            if (v.enable == 0)
                            {
                                if (DateTime.Now.Date > v.endOn.Date)
                                {
                                    v.enable = 3;
                                }
                            }
                            if (enable == 0)
                            {
                                if (v.enable == 0)
                                {
                                    lv.Add(v);
                                }
                            }
                            else
                            {
                                lv.Add(v);
                            }

                        }
                    }
                }
            }
            catch
            {
            }
            return lv;
        }

        /// <summary>
        /// 按实际类型获取代金券
        /// </summary>
        /// <param name="uid"></param>
        /// <param name="orderNo"></param>
        /// <param name="enable"></param>
        /// <param name="voucherNo"></param>
        /// <returns></returns>
        public List<voucher> GetVoucherListForType(int uid, string orderNo, int enable, string voucherNo, string types)
        {
            List<voucher> lv = new List<voucher>();
            string sql = "select * from t_voucher where uId = " + uid + " order by endOn asc,enable asc";
            if (orderNo.Length > 0)
            {
                sql = "select * from t_voucher where orderNo = '" + orderNo + "' order by endOn asc,enable asc";
            }
            if (enable > -1)
            {
                sql = "select * from t_voucher where uId = " + uid + " and enable = " + enable + " order by endOn asc,enable asc";
                if (orderNo.Length > 0)
                {
                    sql = "select * from t_voucher where orderNo = '" + orderNo + "' and enable = " + enable + " order by endOn asc,enable asc";
                }
            }
            if (voucherNo.Length > 0)
            {
                sql = "select * from t_voucher where voucherNo = '" + voucherNo + "' order by endOn asc,enable asc";
            }

            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        foreach (DataRow r in dt.Rows)
                        {
                            voucher v = new voucher
                            {
                                id = Convert.ToInt32(r["id"]),
                                voucherFee = Convert.ToInt16(r["voucherFee"]),
                                voucherNo = r["voucherNo"].ToString(),
                                voucherTitle = r["voucherTitle"].ToString(),
                                addOn = Convert.ToDateTime(r["addOn"]),
                                endOn = Convert.ToDateTime(r["endOn"]),
                                enable = Convert.ToInt16(r["enable"]),
                                voucherType = Convert.ToInt16(r["voucherType"]),
                                orderNo = r["orderNo"].ToString(),
                                uid = Convert.ToInt32(r["uid"]),
                                srcUid = Convert.ToInt32(r["srcUid"]),
                                cardId = r["cardId"].ToString()
                            };

                            if (types.Length > 0 && ("," + types + ",").IndexOf("," + v.voucherType + ",") == -1)
                            {
                                continue;
                            }

                            if (v.enable == 1)
                            {
                                v.useOn = Convert.ToDateTime(r["useOn"]);
                                v.useFee = Convert.ToDouble(r["useFee"]);
                            }
                            if (v.enable == 0)
                            {
                                if (DateTime.Now.Date > v.endOn.Date)
                                {
                                    v.enable = 3;
                                }
                            }

                            //产品更新
                            if (v.voucherType == 2 || v.voucherType == 3 || v.voucherType == 4 || v.voucherType == 5)
                            {
                                v.voucherType = 8;
                            }

                            if (enable == 0)
                            {
                                if (v.enable == 0)
                                {
                                    lv.Add(v);
                                }
                            }
                            else
                            {
                                lv.Add(v);
                            }

                        }
                    }
                }
            }
            catch
            {
            }
            return lv;
        }


        public List<voucher> GetVoucherList(int uid)
        {
            List<voucher> lv = new List<voucher>();
            string sql = "select * from t_voucher where uid = " + uid + " and enable = 0 order by addOn asc";
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        foreach (DataRow r in dt.Rows)
                        {
                            voucher v = new voucher
                            {
                                id = Convert.ToInt32(r["id"]),
                                voucherFee = Convert.ToInt16(r["voucherFee"]),
                                voucherNo = r["voucherNo"].ToString(),
                                voucherTitle = r["voucherTitle"].ToString(),
                                addOn = Convert.ToDateTime(r["addOn"]),
                                endOn = Convert.ToDateTime(r["endOn"]),
                                enable = Convert.ToInt16(r["enable"]),
                                voucherType = Convert.ToInt16(r["voucherType"]),
                                orderNo = r["orderNo"].ToString(),
                                uid = Convert.ToInt32(r["uid"]),
                                srcUid = Convert.ToInt32(r["srcUid"]),
                                cardId = r["cardId"].ToString()
                            };
                            if (v.enable == 1)
                            {
                                v.useOn = Convert.ToDateTime(r["useOn"]);
                                v.useFee = Convert.ToDouble(r["useFee"]);
                            }
                            if (v.enable == 0)
                            {
                                if (DateTime.Now.Date < v.endOn.Date)
                                {
                                    v.enable = 3;
                                }
                            }
                            lv.Add(v);
                        }
                    }
                }
            }
            catch
            {
            }
            return lv;
        }


        public List<voucher> GetVoucherList(string sql, string sql_c, out int Count)
        {
            List<voucher> lv = new List<voucher>();

            int LogCount = 1;
            try
            {
                LogCount = Convert.ToInt32(helper.GetOne(sql_c));
            }
            catch
            {
                LogCount = 1;
            }
            Count = LogCount;

            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        foreach (DataRow r in dt.Rows)
                        {
                            voucher v = new voucher
                            {
                                id = Convert.ToInt32(r["id"]),
                                voucherFee = Convert.ToInt16(r["voucherFee"]),
                                voucherNo = r["voucherNo"].ToString(),
                                voucherTitle = r["voucherTitle"].ToString(),
                                addOn = Convert.ToDateTime(r["addOn"]),
                                endOn = Convert.ToDateTime(r["endOn"]),
                                enable = Convert.ToInt16(r["enable"]),
                                voucherType = Convert.ToInt16(r["voucherType"]),
                                orderNo = r["orderNo"].ToString(),
                                uid = Convert.ToInt32(r["uid"]),
                                srcUid = Convert.ToInt32(r["srcUid"]),
                                cardId = r["cardId"].ToString()
                            };
                            if (v.enable == 1)
                            {
                                v.useOn = Convert.ToDateTime(r["useOn"]);
                                v.useFee = Convert.ToDouble(r["useFee"]);
                            }
                            if (v.enable == 0)
                            {
                                if (DateTime.Now.Date < v.endOn.Date)
                                {
                                    v.enable = 3;
                                }
                            }
                            lv.Add(v);
                        }
                    }
                }
            }
            catch
            {
            }
            return lv;
        }

        public void SendVoucher(int uid, int srcUid)
        {
            voucher v = null;
            //6张10元
            /*
            for (int i = 0; i < 6; i++)
            {
                v = new voucher
                {
                    uid = uid,
                    voucherFee = 10,
                    voucherNo = "R" + DateTime.Now.ToString("yyMMddHHmmss") + uid.ToString().PadLeft(4, '0') + "0" + i,
                    enable = 0,
                    addOn = DateTime.Now,
                    srcUid = srcUid,
                    voucherTitle = "现金红包",
                    //endOn = DateTime.Now.AddDays(30)
                    endOn = Convert.ToDateTime("2016-12-31") //DateTime.Now.AddMonths(1)
                };
                new Main().AddToDb(v, "t_voucher");
            }
            */
            //5张20
            for (int i = 0; i < 2; i++)
            {
                v = new voucher
                {
                    uid = uid,
                    voucherFee = 10,
                    voucherNo = "R" + DateTime.Now.ToString("yyMMddHHmmss") + uid.ToString().PadLeft(4, '0') + "02" + i.ToString(),
                    enable = 0,
                    addOn = DateTime.Now,
                    srcUid = srcUid,
                    voucherTitle = "现金红包",
                    //endOn = DateTime.Now.AddDays(30),
                    endOn = Convert.ToDateTime("2017-12-31"),//DateTime.Now.AddMonths(1),
                    voucherType = 0
                };
                new Main().AddToDb(v, "t_voucher");
            }

            //2张50
            for (int i = 0; i < 2; i++)
            {
                v = new voucher
                {
                    uid = uid,
                    voucherFee = 50,
                    voucherNo = "R" + DateTime.Now.ToString("yyMMddHHmmss") + uid.ToString().PadLeft(4, '0') + "03" + i.ToString(),
                    enable = 0,
                    addOn = DateTime.Now,
                    srcUid = srcUid,
                    voucherTitle = "贵宾服务",
                    //endOn = DateTime.Now.AddDays(30),
                    endOn = Convert.ToDateTime("2017-12-31"),//DateTime.Now.AddMonths(1),
                    voucherType = 1
                };
                new Main().AddToDb(v, "t_voucher");
            }
        }


        public void SendVoucherForWs(int uid, int srcUid)
        {
            voucher v = null;
            
            //1张20
            for (int i = 0; i < 2; i++)
            {
                v = new voucher
                {
                    uid = uid,
                    voucherFee = 10,
                    voucherNo = "R" + DateTime.Now.ToString("yyMMddHHmmss") + uid.ToString().PadLeft(4, '0') + "02" + i.ToString(),
                    enable = 0,
                    addOn = DateTime.Now,
                    srcUid = srcUid,
                    voucherTitle = "现金红包",
                    //endOn = DateTime.Now.AddDays(30),
                    endOn = Convert.ToDateTime("2017-12-31"),//DateTime.Now.AddMonths(1),
                    voucherType = 0
                };
                new Main().AddToDb(v, "t_voucher");
            }

            //2张50
            for (int i = 0; i < 10; i++)
            {
                v = new voucher
                {
                    uid = uid,
                    voucherFee = 10,
                    voucherNo = "R" + DateTime.Now.ToString("yyMMddHHmmss") + uid.ToString().PadLeft(4, '0') + "03" + i.ToString(),
                    enable = 0,
                    addOn = DateTime.Now,
                    srcUid = srcUid,
                    voucherTitle = "现金红包",
                    //endOn = DateTime.Now.AddDays(30),
                    endOn = Convert.ToDateTime("2017-12-31"),//DateTime.Now.AddMonths(1),
                    voucherType = 0
                };
                new Main().AddToDb(v, "t_voucher");
            }
        }


    }

    public class VoucherMsg : DbCenter
    {
        public int uid { get; set; }
        public string nickName { get; set; }
        public string openId { get; set; }

        public Dictionary<int, VoucherMsg> GetVoucherList()
        {

            Dictionary<int, VoucherMsg> dic = new Dictionary<int, VoucherMsg>();
            try
            {
                using (DataTable dt = helper.GetDataTable("select a.uid,b.openid,b.nickName from t_voucher as a join t_user as b on a.uid = b.id where  a.endOn > CURDATE() and DATE_ADD(CURDATE(),INTERVAL 5 DAY) > a.endOn AND a.voucherType = 0 and a.enable = 0"))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        foreach (DataRow r in dt.Rows)
                        {
                            if (!dic.ContainsKey(Convert.ToInt32(r["uid"])))
                            {
                                VoucherMsg vm = new VoucherMsg
                                {
                                    uid = Convert.ToInt32(r["uid"]),
                                    nickName = r["nickName"].ToString(),
                                    openId = r["openId"].ToString()
                                };
                                dic.Add(Convert.ToInt32(r["uid"]), vm);
                            }
                        }
                    }
                }
            }
            catch
            {
            }
            return dic;
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Model;
using Model.travel;

namespace Data
{
    public class _TravelProduct:DbCenter
    {
        public List<travelProductInfo> GetSimpleProductList(string sql)
        {
            List<travelProductInfo> lp = new List<travelProductInfo>();
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    Dictionary<int, int> Dic = new _Class().getClassDicID();
                    foreach (DataRow r in dt.Rows)
                    {
                        travelProductInfo b = new travelProductInfo
                        {
                            id = Convert.ToInt16(r["id"]),
                            cId = Convert.ToInt16(r["cId"]),
                            pId = Convert.ToInt16(r["cId"]),
                            title = r["title"].ToString(),
                            isTj = Convert.ToInt16(r["isTj"]),
                            isHref = Convert.ToInt16(r["isHref"]),
                            hrefUrl = r["hrefUrl"].ToString(),
                            imgUrl = r["imgUrl"].ToString(),
                            imgUrlHb = r["imgUrlHb"].ToString(),
                            price = Convert.ToInt32(r["price"].ToString()),
                            desp = r["desp"].ToString()
                        };
                        if (Dic.ContainsKey(b.cId))
                        {
                            b.pId = Dic[b.cId];
                        }
                        lp.Add(b);
                    }
                }
            }
            return lp;
        }

        public travelProductInfo GetInfo(int id)
        {
            travelProductInfo c = null;
            using (DataTable dt = helper.GetDataTable("select * from t_travel_product where id = " + id + " and enable = 0"))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    Dictionary<int, int> Dic = new _Class().getClassDicID();
                    DataRow r = dt.Rows[0];
                    {
                        c = new travelProductInfo
                        {
                            id = Convert.ToInt16(r["id"]),
                            cId = Convert.ToInt16(r["cId"]),
                            title = r["title"].ToString(),
                            contents = r["contents"].ToString(),
                            content_fy = r["content_fy"].ToString(),
                            content_xc = r["content_xc"].ToString(),
                            content_xz = r["content_xz"].ToString(),
                            isHot = Convert.ToInt16(r["isHot"]),
                            isTj = Convert.ToInt16(r["isTj"]),
                            isHref = Convert.ToInt16(r["isHref"]),
                            hrefUrl = r["hrefUrl"].ToString(),
                            adminId = Convert.ToInt16(r["adminId"]),
                            imgUrl = r["imgUrl"].ToString(),
                            imgUrlHb = r["imgUrlHb"].ToString(),
                            desp = r["desp"].ToString(),
                            enable = Convert.ToInt16(r["enable"]),
                            price = Convert.ToInt32(r["price"].ToString()),
                            addOn = Convert.ToDateTime(r["AddOn"])
                        };
                        if (Dic.ContainsKey(c.cId))
                        {
                            c.pId = Dic[c.cId];
                        }
                    }
                }
            }
            return c;
        }

        public List<travelProduct> GetProductList(string sql, string sql_c, out int Count)
        {
            List<travelProduct> ls = new List<travelProduct>();

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

            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    try
                    {
                        foreach (DataRow r in dt.Rows)
                        {
                            travelProduct s = new travelProduct
                            {
                                id = Convert.ToInt16(r["id"]),
                                cId = Convert.ToInt16(r["cId"]),
                                title = r["title"].ToString(),
                                contents = "",
                                content_fy = "",
                                content_xc = "",
                                content_xz = "",
                                isTj = Convert.ToInt16(r["isTj"]),
                                isHot = Convert.ToInt16(r["isHot"]),
                                isHref = Convert.ToInt16(r["isHref"]),
                                adminId = Convert.ToInt16(r["adminId"]),
                                imgUrl = r["imgUrl"].ToString(),
                                imgUrlHb = r["imgUrlHb"].ToString(),
                                hrefUrl = r["hrefUrl"].ToString(),
                                desp = r["desp"].ToString(),
                                enable = Convert.ToInt16(r["enable"]),
                                price = Convert.ToInt32(r["price"].ToString()),
                                addOn = Convert.ToDateTime(r["AddOn"])
                            };
                            ls.Add(s);
                        }
                    }
                    catch (Exception ex)
                    {

                    }
                }
            }
            return ls;
        }

        public int CheckProduct(string title, int cId)
        {
            int hid = 0;
            string sql = "select * from t_travel_product where cId = " + cId + " and title = '" + title + "' and enable = 0";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    hid = Convert.ToInt16(dt.Rows[0]["Id"]);
                }
            }
            return hid;
        }
    }
}

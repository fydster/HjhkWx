using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using Model;
using System.Text.RegularExpressions;

namespace Data
{
    public class _Content:DbCenter
    {
        public List<content> GetContentList(string sql)
        {
            List<content> lp = new List<content>();
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    Dictionary<int, tClass> Dic = new _Class().getClassDicFObj();
                    foreach (DataRow r in dt.Rows)
                    {
                        content b = new content
                        {
                            id = Convert.ToInt16(r["id"]),
                            cId = Convert.ToInt16(r["cId"]),
                            cType = Convert.ToInt16(r["cType"]),
                            title = r["title"].ToString(),
                            contents = r["contents"].ToString(),
                            isHot = Convert.ToInt16(r["isHot"]),
                            isCheck = Convert.ToInt16(r["isCheck"]),
                            adminId = Convert.ToInt16(r["adminId"]),
                            checkId = Convert.ToInt16(r["checkId"]),
                            cDate = Convert.ToDateTime(r["cDate"]),
                            imgUrl = r["imgUrl"].ToString(),
                            isHref = Convert.ToInt16(r["isHref"]),
                            hrefUrl = r["hrefUrl"].ToString(),
                            source = r["source"].ToString(),
                            enable = Convert.ToInt16(r["enable"]),
                            wp_tel = r["wp_tel"].ToString(),
                            wp_addr = r["wp_addr"].ToString(),
                            wp_contact = r["wp_contact"].ToString(),
                            addOn = Convert.ToDateTime(r["AddOn"])
                        };
                        b.contents = StripHTML(b.contents);
                        if (b.contents.Length > 30)
                        {
                            b.contents = b.contents.Substring(0, 30);
                        }
                        if (b.imgUrl.Length == 0)
                        {
                            if (Dic.ContainsKey(b.cId))
                            {
                                b.imgUrl = Dic[b.cId].defaultUrl;
                            }
                        }
                        lp.Add(b);
                    }
                }
            }
            return lp;
        }

        public List<SimpleContent> GetSimpleContentList(string sql)
        {
            List<SimpleContent> lp = new List<SimpleContent>();
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        SimpleContent b = new SimpleContent
                        {
                            id = Convert.ToInt16(r["id"]),
                            title = r["title"].ToString(),
                            imgUrl = r["imgUrl"].ToString(),
                            source = r["source"].ToString(),
                        };
                        lp.Add(b);
                    }
                }
            }
            return lp;
        }

        public ContentInfo GetContent(int id)
        {
            ContentInfo c = null;
            using (DataTable dt = helper.GetDataTable("select * from t_content where id = " + id + " and enable = 0"))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    DataRow r = dt.Rows[0];
                    {
                        c = new ContentInfo
                        {
                            id = Convert.ToInt16(r["id"]),
                            cId = Convert.ToInt16(r["cId"]),
                            cType = Convert.ToInt16(r["cType"]),
                            title = r["title"].ToString(),
                            contents = r["contents"].ToString(),
                            isHot = Convert.ToInt16(r["isHot"]),
                            isCheck = Convert.ToInt16(r["isCheck"]),
                            adminId = Convert.ToInt16(r["adminId"]),
                            checkId = Convert.ToInt16(r["checkId"]),
                            cDate = Convert.ToDateTime(r["cDate"]),
                            imgUrl = r["imgUrl"].ToString(),
                            isHref = Convert.ToInt16(r["isHref"]),
                            hrefUrl = r["hrefUrl"].ToString(),
                            source = r["source"].ToString(),
                            enable = Convert.ToInt16(r["enable"]),
                            wp_tel = r["wp_tel"].ToString(),
                            wp_addr = r["wp_addr"].ToString(),
                            wp_contact = r["wp_contact"].ToString(),
                            addOn = Convert.ToDateTime(r["AddOn"])
                        };
                        c.c = new _Class().GetClassInfo(c.cId);
                    }
                }
            }
            return c;
        }

        public Dictionary<int, int> getClassCountDic()
        {
            Dictionary<int, int> Dic = new Dictionary<int, int>();
            string sql = "select cId,count(id) as t from t_content where enable = 0 group by cId";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        Dic.Add(Convert.ToInt16(r["cId"]), Convert.ToInt16(r["t"]));
                    }
                }
            }
            return Dic;
        }

        public List<ContentInfo> GetContentList(string sql, string sql_c, out int Count)
        {
            List<ContentInfo> ls = new List<ContentInfo>();

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
                    Dictionary<int, string> Dic = new _AdminUser().GetAdminUserDic();
                    try
                    {
                        foreach (DataRow r in dt.Rows)
                        {
                            ContentInfo s = new ContentInfo
                            {
                                id = Convert.ToInt16(r["id"]),
                                cId = Convert.ToInt16(r["cId"]),
                                cType = Convert.ToInt16(r["cType"]),
                                title = r["title"].ToString(),
                                contents = r["contents"].ToString(),
                                isHot = Convert.ToInt16(r["isHot"]),
                                isCheck = Convert.ToInt16(r["isCheck"]),
                                adminId = Convert.ToInt16(r["adminId"]),
                                checkId = Convert.ToInt16(r["checkId"]),
                                cDate = Convert.ToDateTime(r["cDate"]),
                                imgUrl = r["imgUrl"].ToString(),
                                isHref = Convert.ToInt16(r["isHref"]),
                                hrefUrl = r["hrefUrl"].ToString(),
                                source = r["source"].ToString(),
                                enable = Convert.ToInt16(r["enable"]),
                                wp_tel = r["wp_tel"].ToString(),
                                wp_addr = r["wp_addr"].ToString(),
                                wp_contact = r["wp_contact"].ToString(),
                                addOn = Convert.ToDateTime(r["AddOn"]),
                                checkName = "--",
                                adminName = "--"
                            };
                            s.c = new _Class().GetClassInfo(s.cId);
                            if (Dic.ContainsKey(s.checkId))
                            {
                                s.checkName = Dic[s.checkId];
                            }
                            if (Dic.ContainsKey(s.adminId))
                            {
                                s.adminName = Dic[s.adminId];
                            }
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

        public int CheckContent(string title,int cId)
        {
            int hid = 0;
            string sql = "select * from t_content where cId = " + cId + " and title = '" + title + "' and enable = 0";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    hid = Convert.ToInt16(dt.Rows[0]["Id"]);
                }
            }
            return hid;
        }

        public static string StripHTML(string strHtml)
          {
            string[]aryReg =
            {
              @"<script[^>]*?>.*?</script>",
              @"<(\/\s*)?!?((\w+:)?\w+)(\w+(\s*=?\s*(([""'])(\\[""'tbnr]|[^\7])*?\7|\w+)|.{0})|\s)*?(\/\s*)?>", @"([\r\n])[\s]+", 
              @"&(quot|#34);", @"&(amp|#38);", @"&(lt|#60);", @"&(gt|#62);", 
              @"&(nbsp|#160);", @"&(iexcl|#161);", @"&(cent|#162);", @"&(pound|#163);",
              @"&(copy|#169);", @"&#(\d+);", @"-->", @"<!--.*\n"
            };

            string[]aryRep =
            {
              "", "", "", "\"", "&", "<", ">", "   ", "\xa1",  //chr(161),
              "\xa2",  //chr(162),
              "\xa3",  //chr(163),
              "\xa9",  //chr(169),
              "", "\r\n", ""
            };

            string newReg = aryReg[0];
            string strOutput = strHtml;
            for (int i = 0; i < aryReg.Length; i++)
            {
              Regex regex = new Regex(aryReg[i], RegexOptions.IgnoreCase);
              strOutput = regex.Replace(strOutput, aryRep[i]);
            }
            strOutput.Replace("<", "");
            strOutput.Replace(">", "");
            strOutput.Replace("\r\n", "");
            return strOutput;
          }

    }
}

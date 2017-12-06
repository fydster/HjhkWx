using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Model;

namespace Data
{
    public class _Class:DbCenter
    {
        public List<tClass> GetClassList(int cType)
        {
            List<tClass> lp = new List<tClass>();
            string sql = "select * from t_class where cType = " + cType + " and Enable = 0 order by descNum desc,id asc";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        tClass b = new tClass
                        {
                            id = Convert.ToInt16(r["Id"]),
                            pId = Convert.ToInt16(r["pId"]),
                            cType = Convert.ToInt16(r["cType"]),
                            name = r["Name"].ToString(),
                            logoUrl = r["LogoUrl"].ToString(),
                            isShow = Convert.ToInt16(r["isShow"]),
                            sType = Convert.ToInt16(r["sType"]),
                            defaultUrl = r["defaultUrl"].ToString(),
                            addOn = Convert.ToDateTime(r["AddOn"])
                        };
                        lp.Add(b);
                    }
                }
            }
            return lp;
        }

        public List<tClass> GetClassListForCID(int cType,int CID)
        {
            List<tClass> lp = new List<tClass>();
            string sql = "select * from t_class where pid = " + CID + " and cType = " + cType + " and Enable = 0 order by id asc";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        tClass b = new tClass
                        {
                            id = Convert.ToInt16(r["Id"]),
                            pId = Convert.ToInt16(r["pId"]),
                            cType = Convert.ToInt16(r["cType"]),
                            name = r["Name"].ToString(),
                            logoUrl = r["LogoUrl"].ToString(),
                            isShow = Convert.ToInt16(r["isShow"]),
                            sType = Convert.ToInt16(r["sType"]),
                            defaultUrl = r["defaultUrl"].ToString(),
                            addOn = Convert.ToDateTime(r["AddOn"])
                        };
                        lp.Add(b);
                    }
                }
            }
            return lp;
        }

        public List<ClassInfo> GetClassListForCount(int CID)
        {
            List<ClassInfo> lp = new List<ClassInfo>();
            string sql = "select * from t_class where pid = " + CID + " and Enable = 0 order by id asc";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    Dictionary<int, int> Dic = new _Content().getClassCountDic();
                    foreach (DataRow r in dt.Rows)
                    {
                        ClassInfo b = new ClassInfo
                        {
                            id = Convert.ToInt16(r["Id"]),
                            pId = Convert.ToInt16(r["pId"]),
                            cType = Convert.ToInt16(r["cType"]),
                            name = r["Name"].ToString(),
                            logoUrl = r["LogoUrl"].ToString(),
                            isShow = Convert.ToInt16(r["isShow"]),
                            sType = Convert.ToInt16(r["sType"]),
                            defaultUrl = r["defaultUrl"].ToString(),
                            addOn = Convert.ToDateTime(r["AddOn"]),
                            num = 0
                        };
                        if (Dic.ContainsKey(b.id))
                        {
                            b.num = Dic[b.id];
                        }
                        lp.Add(b);
                    }
                }
            }
            return lp;
        }

        public tClass GetClassInfo(int id)
        {
            tClass t = null;
            string sql = "select * from t_class where id = " + id ;
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    DataRow r = dt.Rows[0];
                    {
                        t = new tClass
                        {
                            id = Convert.ToInt16(r["Id"]),
                            pId = Convert.ToInt16(r["pId"]),
                            cType = Convert.ToInt16(r["cType"]),
                            name = r["Name"].ToString(),
                            logoUrl = r["LogoUrl"].ToString(),
                            isShow = Convert.ToInt16(r["isShow"]),
                            sType = Convert.ToInt16(r["sType"]),
                            defaultUrl = r["defaultUrl"].ToString(),
                            addOn = Convert.ToDateTime(r["AddOn"])
                        };
                    }
                }
            }
            return t;
        }

        public Dictionary<int, string> getClassDic()
        {
            Dictionary<int, string> Dic = new Dictionary<int, string>();
            string sql = "select * from t_class";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        Dic.Add(Convert.ToInt16(r["Id"]), r["Name"].ToString());
                    }
                }
            }
            return Dic;
        }

        public Dictionary<int, int> getClassDicID()
        {
            Dictionary<int, int> Dic = new Dictionary<int, int>();
            string sql = "select * from t_class";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        Dic.Add(Convert.ToInt16(r["Id"]), Convert.ToInt16(r["pId"]));
                    }
                }
            }
            return Dic;
        }

        public string GetCidNames(string cids)
        {
            Dictionary<int, string> Dic = getClassDic();
            string cidNames = "";
            string[] cidArr = cids.Split(',');
            foreach (string item in cidArr)
            {
                if (item.Length > 0)
                {
                    if (Dic.ContainsKey(Convert.ToInt16(item)))
                    {
                        cidNames += Dic[Convert.ToInt16(item)] + ",";
                    }
                }
            }
            return cidNames;
        }

        public Dictionary<int, tClass> getClassDicFObj()
        {
            Dictionary<int, tClass> Dic = new Dictionary<int, tClass>();
            string sql = "select * from t_class";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        tClass t = new tClass
                        {
                            id = Convert.ToInt16(r["Id"]),
                            pId = Convert.ToInt16(r["pId"]),
                            cType = Convert.ToInt16(r["cType"]),
                            name = r["Name"].ToString(),
                            logoUrl = r["LogoUrl"].ToString(),
                            isShow = Convert.ToInt16(r["isShow"]),
                            sType = Convert.ToInt16(r["sType"]),
                            defaultUrl = r["defaultUrl"].ToString(),
                            addOn = Convert.ToDateTime(r["AddOn"])
                        };
                        Dic.Add(Convert.ToInt16(r["Id"]), t);
                    }
                }
            }
            return Dic;
        }

        public int CheckClass(string Name, int cType, int pId)
        {
            int hid = 0;
            string sql = "select * from t_class where pId = " + pId + " and cType = " + cType + " and Name = '" + Name + "' and Enable = 0";
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

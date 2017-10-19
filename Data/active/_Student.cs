using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Model.active;

namespace Data.active
{
    public class _Student:DbCenter
    {
        public List<Student> GetStudentList(string keywords)
        {
            List<Student> lc = new List<Student>();

            string sql = "select * from t_active_student where enable = 0 " + keywords + " order by addOn desc";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        Student o = new Student()
                        {
                            uId = Convert.ToInt32(r["uid"]),
                            srcProvice = r["srcProvice"].ToString(),
                            srcCity = r["srcCity"].ToString(),
                            toProvice = r["toProvice"].ToString(),
                            toCity = r["toCity"].ToString(),
                            contact = r["contact"].ToString(),
                            mobile = r["mobile"].ToString(),
                            nickName = r["nickName"].ToString(),
                            colage = r["colage"].ToString(),
                            photoUrl = r["photoUrl"].ToString(),
                            addOn = Convert.ToDateTime(r["addOn"]),
                            state = Convert.ToInt16(r["state"]),
                            memo = r["memo"].ToString()
                        };
                        lc.Add(o);
                    }
                }
            }
            return lc;
        }


        public int GetStudentNum(int uid,int sType)
        {
            int Num = 0;

            string sql = "select count(id) as b from t_active_student where uid = " + uid + " and sType = " + sType + " and enable = 0";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    Num = Convert.ToInt16(dt.Rows[0]["b"]);
                }
            }
            return Num;
        }
    }
}

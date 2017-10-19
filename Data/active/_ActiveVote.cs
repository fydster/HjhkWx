using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Model;
using Model.active;

namespace Data.active
{
    public class _ActiveVote:DbCenter
    {
        public List<VoteUser> GetUser(string sql, string sql_c, out int UCount)
        {
            int Count = 0;
            try
            {
                Count = Convert.ToInt32(helper.GetOne(sql_c));
            }
            catch
            {
                Count = 0;
            }
            List<VoteUser> lu = new List<VoteUser>();
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        foreach (DataRow r in dt.Rows)
                        {

                            VoteUser u = new VoteUser()
                            {
                                addOn = Convert.ToDateTime(r["addOn"]),
                                bNo = r["bNo"].ToString(),
                                Contact = r["contact"].ToString(),
                                Img_one = r["Img_one"].ToString(),
                                Img_home = r["Img_home"].ToString(),
                                Mobile = r["mobile"].ToString(),
                                openId = r["openid"].ToString(),
                                uid = Convert.ToInt32(r["uid"])
                            };
                            lu.Add(u);
                        }
                    }
                }
            }
            catch { }
            UCount = Count;
            return lu;
        }

        public List<VoteUser> GetVoteUser()
        {
            string sql = "select * from t_acive_voteuser where LENGTH(bNo) = 7 and isVote = 1 order by bNo ASC";
            List<VoteUser> lu = new List<VoteUser>();
            Dictionary<string, int> Dic = new Dictionary<string, int>();
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        foreach (DataRow r in dt.Rows)
                        {

                            VoteUser u = new VoteUser()
                            {
                                addOn = Convert.ToDateTime(r["addOn"]),
                                bNo = r["bNo"].ToString(),
                                Contact = r["contact"].ToString(),
                                Img_one = r["Img_one"].ToString(),
                                Img_home = r["Img_home"].ToString(),
                                Mobile = r["mobile"].ToString(),
                                openId = r["openid"].ToString(),
                                uid = Convert.ToInt32(r["uid"])
                            };
                            if (!Dic.ContainsKey(u.bNo))
                            {
                                lu.Add(u);
                                Dic.Add(u.bNo, u.uid);
                            }
                            
                        }
                    }
                }
            }
            catch { }
            return lu;
        }

        public Dictionary<string,VoteUser> GetVoteUserDic()
        {
            string sql = "select * from t_acive_voteuser where LENGTH(bNo) = 7 and isVote = 1 order by bNo ASC";
            Dictionary<string, VoteUser> Dic = new Dictionary<string, VoteUser>();
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        foreach (DataRow r in dt.Rows)
                        {

                            VoteUser u = new VoteUser()
                            {
                                addOn = Convert.ToDateTime(r["addOn"]),
                                bNo = r["bNo"].ToString(),
                                Contact = r["contact"].ToString(),
                                Img_one = r["Img_one"].ToString(),
                                Img_home = r["Img_home"].ToString(),
                                Mobile = r["mobile"].ToString(),
                                openId = r["openid"].ToString(),
                                uid = Convert.ToInt32(r["uid"])
                            };
                            if (!Dic.ContainsKey(u.bNo))
                            {
                                Dic.Add(u.bNo, u);
                            }

                        }
                    }
                }
            }
            catch { }
            return Dic;
        }

        /// <summary>
        /// 获取投票明细
        /// </summary>
        /// <param name="sql"></param>
        /// <param name="sql_c"></param>
        /// <param name="UCount"></param>
        /// <returns></returns>
        public List<Vote> GetVoteMx(string sql, string sql_c, out int UCount)
        {
            int Count = 0;
            try
            {
                Count = Convert.ToInt32(helper.GetOne(sql_c));
            }
            catch
            {
                Count = 0;
            }
            List<Vote> lu = new List<Vote>();
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        foreach (DataRow r in dt.Rows)
                        {

                            Vote u = new Vote()
                            {
                                addOn = Convert.ToDateTime(r["addOn"]),
                                bNo = r["bNo"].ToString(),
                                nickName = r["nickName"].ToString(),
                                photoUrl = r["photoUrl"].ToString(),
                                uid = Convert.ToInt32(r["uid"])
                            };
                            lu.Add(u);
                        }
                    }
                }
            }
            catch { }
            UCount = Count;
            return lu;
        }

        public List<VotePm> GetVotePm()
        {
            string sql = "select bNo,count(id) as t from t_active_vote group by bNo order by t desc";
            List<VotePm> lu = new List<VotePm>();
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        foreach (DataRow r in dt.Rows)
                        {

                            VotePm u = new VotePm()
                            {
                                bNo = r["bNo"].ToString(),
                                num = Convert.ToInt32(r["t"])
                            };
                            lu.Add(u);

                        }
                    }
                }
            }
            catch { }
            return lu;
        }

        public List<VotePmInfo> GetVotePmInfo()
        {
            string sql = "select bNo,count(id) as t from t_active_vote group by bNo order by t desc";
            List<VotePmInfo> lu = new List<VotePmInfo>();
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        Dictionary<string, VoteUser> Dic = GetVoteUserDic();
                        foreach (DataRow r in dt.Rows)
                        {

                            VotePmInfo u = new VotePmInfo()
                            {
                                bNo = r["bNo"].ToString(),
                                num = Convert.ToInt32(r["t"]),
                                contact = ""
                            };
                            if (Dic.ContainsKey(u.bNo))
                            {
                                u.contact = Dic[u.bNo].Contact;
                            }
                            lu.Add(u);

                        }
                    }
                }
            }
            catch { }
            return lu;
        }

        public Dictionary<string,int> GetVoteDic()
        {
            string sql = "select bNo,count(id) as t from t_active_vote group by bNo order by t desc";
            Dictionary<string, int> Dic = new Dictionary<string, int>();
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        foreach (DataRow r in dt.Rows)
                        {

                            VotePm u = new VotePm()
                            {
                                bNo = r["bNo"].ToString(),
                                num = Convert.ToInt32(r["t"])
                            };
                            if (!Dic.ContainsKey(u.bNo))
                            {
                                Dic.Add(u.bNo, u.num);
                            }
                            

                        }
                    }
                }
            }
            catch { }
            return Dic;
        }

        public int GetVote(int uid)
        {
            int pm = 0;
            string sql = "select count(id) as t from t_active_vote where date(NOW()) = date(addOn) and uid = " + uid;
            try
            {
                pm = Convert.ToInt16(helper.GetOne(sql));
            }
            catch
            {
                pm = 0;
            }
            return pm;
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using com.seascape.db;
using System.Data;

namespace Train
{
    public class Main:DbCenter
    {

        /// <summary>
        /// 直接插入数据库操作
        /// </summary>
        /// <param name="o"></param>
        /// <param name="tableName"></param>
        /// <returns></returns>
        public bool AddToDb(object o,string tableName)
        {
            WriteLog("---3-1---");
            bool result = false;
            try
            {
                SqlObject s = new SqlObject(SqlObjectType.Insert, tableName, DBTYPE.MySql);
                WriteLog("---3-2---");
                foreach (System.Reflection.PropertyInfo p in o.GetType().GetProperties())
                {
                    WriteLog("---3-2-1--" + p.Name);
                    if (p.GetValue(o, null) != null && p.GetValue(o, null).ToString().Length > 0)
                    {
                        if (p.Name != "id" && p.Name != "helper")
                        {
                            s.AddField(p.Name, p.GetValue(o, null), GetSqlFieldType(p.PropertyType.Name));
                        }
                    }
                }
                WriteLog("---3-3---" + s.ToString());
                WriteLog("----3---3---" + helper.GetConnString() + ",state:" + helper.GetConnection().State);
                result = helper.ExecuteSqlNoResult(s.ToString());
                WriteLog("---3-4---" + result.ToString());
            }
            catch(Exception e)
            {
                WriteLog("---3-1-1--" + e.Message);
            }
            return result;
        }

        private void WriteLog(string strMemo)
        {
            return;
            string filename = "D:/HjhkTest/log/train_order_" + DateTime.Now.ToString("yyMMdd") + ".txt";
            strMemo = "[" + DateTime.Now.ToString("MM-dd HH:mm:ss") + "]" + strMemo;
            System.IO.StreamWriter sr = null;
            try
            {
                if (!System.IO.File.Exists(filename))
                {
                    sr = System.IO.File.CreateText(filename);
                }
                else
                {
                    sr = System.IO.File.AppendText(filename);
                }
                sr.WriteLine(strMemo);
            }
            catch
            {
            }
            finally
            {
                if (sr != null)
                    sr.Close();
            }
        }

        /// <summary>
        /// 获取SQL语句
        /// </summary>
        /// <param name="o"></param>
        /// <param name="tableName"></param>
        /// <returns></returns>
        public string GetSqlInfo(object o, string tableName)
        {
            SqlObject s = new SqlObject(SqlObjectType.Insert, tableName, DBTYPE.MySql);
            foreach (System.Reflection.PropertyInfo p in o.GetType().GetProperties())
            {
                if (p.GetValue(o, null) != null && p.GetValue(o, null).ToString().Length > 0)
                {
                    if (p.Name != "id" && p.Name != "helper")
                    {
                        s.AddField(p.Name, p.GetValue(o, null), GetSqlFieldType(p.PropertyType.Name));
                    }
                }
            }
            return s.ToString();
        }

        /// <summary>
        /// 直接插入数据库操作并获取ID
        /// </summary>
        /// <param name="o"></param>
        /// <param name="tableName"></param>
        /// <returns></returns>
        public int AddToDbForId(object o, string tableName)
        {
            SqlObject s = new SqlObject(SqlObjectType.Insert, tableName, DBTYPE.MySql);
            foreach (System.Reflection.PropertyInfo p in o.GetType().GetProperties())
            {
                if (p.GetValue(o, null) != null && p.GetValue(o, null).ToString().Length > 0)
                {
                    if (p.Name != "id" && p.Name != "helper")
                    {
                        s.AddField(p.Name, p.GetValue(o, null), GetSqlFieldType(p.PropertyType.Name));
                    }
                }
            }
            return helper.InsertToDb(s.ToString()+";");
        }

        /// <summary>
        /// 修改数据库
        /// </summary>
        /// <param name="o"></param>
        /// <param name="tableName"></param>
        /// <param name="where"></param>
        /// <returns></returns>
        public bool UpdateDb(object o, string tableName,string where)
        {
            SqlObject s = new SqlObject(SqlObjectType.Update, tableName,DBTYPE.MySql);
            foreach (System.Reflection.PropertyInfo p in o.GetType().GetProperties())
            {
                if (p.GetValue(o, null) != null)
                {
                    if (p.Name != "id" && p.Name != "helper")
                    {
                        s.AddField(p.Name, p.GetValue(o, null), GetSqlFieldType(p.PropertyType.Name));
                    }
                }
            }
            s.Where = where;
            return helper.ExecuteSqlNoResult(s.ToString());
        }

        /// <summary>
        /// 字段加1操作
        /// </summary>
        /// <param name="tableName"></param>
        /// <param name="field"></param>
        /// <param name="where"></param>
        /// <returns></returns>
        public bool AddOneForField(string tableName, string field,string where,int addNum)
        {
            string sql = "Update " + tableName + " set " + field + " = " + field + " + " + addNum + " where " + where;
            return helper.ExecuteSqlNoResult(sql);
        }

        /// <summary>
        /// 执行全部SQL并返回结果
        /// </summary>
        /// <param name="s"></param>
        /// <returns></returns>
        public bool ExecForSql(List<string> s)
        {
            return helper.ExecuteTransaction(s);
        }

        /// <summary>
        /// 数据库删除
        /// </summary>
        /// <param name="tableName"></param>
        /// <param name="where"></param>
        /// <returns></returns>
        public bool DelDb(string tableName, string where)
        {
            string s = "delete from " + tableName + " where "+where;
            return helper.ExecuteSqlNoResult(s.ToString());
        }

        public SqlFieldType GetSqlFieldType(string t)
        {
            switch (t)
            {
                case "Int32":
                    return SqlFieldType.Int;
                case "Int16":
                    return SqlFieldType.Int;
                case "Int64":
                    return SqlFieldType.Int;
                case "bool":
                    return SqlFieldType.Bool;
                case "DateTime":
                    return SqlFieldType.DateTime;
                case "Double":
                    return SqlFieldType.Float;
            }
            return SqlFieldType.String;
        }

        /// <summary>
        /// 时间戳转时间
        /// </summary>
        /// <param name="timeStamp"></param>
        /// <returns></returns>
        public DateTime GetTime(string timeStamp)
        {
            DateTime dtStart = TimeZone.CurrentTimeZone.ToLocalTime(new DateTime(1970, 1, 1));
            long lTime = long.Parse(timeStamp + "0000000");
            TimeSpan toNow = new TimeSpan(lTime); return dtStart.Add(toNow);
        }


        /// <summary>
        /// 通过身份证获取生日
        /// </summary>
        /// <param name="idCard"></param>
        /// <returns></returns>
        public static DateTime GetBirth(string idCard)
        {
            DateTime birth = DateTime.Now.Date;
            string year = idCard.Substring(6, 4);
            string month = idCard.Substring(10, 2);
            string day = idCard.Substring(12, 2);
            birth = Convert.ToDateTime(year + "-" + month + "-" + day);
            return birth;
        }

        /// <summary>
        /// 通过身份证获取性别
        /// </summary>
        /// <param name="idCard"></param>
        /// <returns></returns>
        public static int GetSex(string idCard)
        {
            int sex = 0;
            int n = Convert.ToInt16(idCard.Substring(16, 1));
            sex = n % 2;
            return sex;
        }
    }
}

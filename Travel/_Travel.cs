using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net;
using System.IO;
using System.Data;
using System.Security.Cryptography;

namespace Travel
{
    public class _Travel:DbCenter
    {
        public static string acctId = "102117";
        public static string apikey = "202093_Ticket";
        public static string SecretKey = "Le2XXdsuQbHQz35ROBYk";
        public string GetTravelResult(string Json,string url)
        {
            string Result = "ERR";
            try
            {
                Result = webRequest(url, Json);
            }
            catch
            {

            }
            return Result;
        }

        /// <summary>
        /// 提交POST信息
        /// </summary>
        /// <param name="url"></param>
        /// <param name="data"></param>
        /// <returns></returns>
        public string webRequest(string url, string data)
        {
            string html = null;
            WebRequest req = WebRequest.Create(url);
            req.Method = "POST";
            byte[] byteArray = Encoding.UTF8.GetBytes(data);
            req.ContentType = "application/json";
            req.ContentLength = byteArray.Length;
            Stream dataStream = req.GetRequestStream();
            dataStream.Write(byteArray, 0, byteArray.Length);
            dataStream.Close();
            WebResponse res = req.GetResponse();

            Stream receiveStream = res.GetResponseStream();
            Encoding encode = Encoding.UTF8;
            StreamReader sr = new StreamReader(receiveStream, encode);
            char[] readbuffer = new char[256];
            int n = sr.Read(readbuffer, 0, 256);
            while (n > 0)
            {
                string str = new string(readbuffer, 0, n);
                html += str;
                n = sr.Read(readbuffer, 0, 256);
            }
            return html;
        }

        public string GetJson(List<travel_para> para,List<travel_para_data> paraData)
        {
            List<travel_para> tempPara = new List<travel_para>();

            string dataJson = "";
            StringBuilder sbData = new StringBuilder();
            foreach (travel_para item in para)
            {
                if (item == para[para.Count - 1])
                {
                    sbData.Append("\"" + item.key + "\":\"" + item.value + "\"");
                }
                else
                {
                    sbData.Append("\"" + item.key + "\":\"" + item.value + "\",");
                }
            }
            if (paraData != null)
            {
                foreach (travel_para_data item in paraData)
                {
                    sbData.Append(",\"" + item.key + "\":{");
                    foreach (var itemD in item.lt)
                    {
                        if (itemD == item.lt[item.lt.Count - 1])
                        {
                            sbData.Append("\"" + itemD.key + "\":\"" + itemD.value + "\"");
                        }
                        else
                        {
                            sbData.Append("\"" + itemD.key + "\":\"" + itemD.value + "\",");
                        }
                    }
                    sbData.Append("}");
                }
            }

            dataJson = sbData.ToString();


            byte[] bytes = Encoding.Default.GetBytes(dataJson);
            string str = Convert.ToBase64String(bytes);
            //加入appKey
            travel_para tp = new travel_para
            {
                key = "apiKey",
                value = apikey,
                vType = 0
            };
            para.Add(tp);

            //加入时间戳
            tp = new travel_para
            {
                key = "timestamp",
                value = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"),
                vType = 0
            };
            para.Add(tp);

            //加入Data参数
            if (paraData != null)
            {
                foreach (var item in paraData)
                {
                    foreach (var itemD in item.lt)
                    {
                        para.Add(itemD);
                    }
                }
            }


            string sign = Sign(para);

            StringBuilder sb = new StringBuilder();
            sb.Append("{");
            sb.Append("\"apiKey\":\"" + apikey + "\",");
            //sb.Append("\"data\":\"" + str + "\",");
            sb.Append("\"data\":{");
            sb.Append(dataJson);
            sb.Append("},");
            sb.Append("\"sign\":\"" + sign + "\",");
            sb.Append("\"timestamp\":\"" + tp.value + "\"");
            sb.Append("}");
            return sb.ToString();
        }

        public string Sign(List<travel_para> para)
        {
            List<travel_para> result = para.OrderByDescending(a => a.key).ToList();
            result.Reverse();
            StringBuilder sb = new StringBuilder();
            sb.Append(SecretKey + "&");
            foreach (travel_para item in result)
            {
                if (item.value.Length > 0)
                {
                    if (item.vType == 0)
                    {
                        sb.Append(item.key + "=" + item.value + "&");
                    }
                    else
                    {
                        sb.Append(item.key + "=" + get_uft8(item.value) + "&");
                    }
                }
            }
            sb.Append(SecretKey);
            string md5str = sb.ToString();
            //md5str = get_uft8(md5str);
            byte[] resultS = Encoding.UTF8.GetBytes(md5str);    //tbPass为输入密码的文本框
            MD5 md5 = new MD5CryptoServiceProvider();
            byte[] output = md5.ComputeHash(resultS);
            return BitConverter.ToString(output).Replace("-", "").ToUpper();
            //return com.seascape.tools.BasicTool.MD5(md5str).ToUpper();
        }

        public static string get_uft8(string unicodeString)
        {
            UTF8Encoding utf8 = new UTF8Encoding();
            Byte[] encodedBytes = utf8.GetBytes(unicodeString);
            String decodedString = utf8.GetString(encodedBytes);
            return decodedString;
        }

        public int GetScenciCount(string scenciId, int productId)
        {
            int Num = 0;
            try
            {
                string sql = "select count(id) as t from t_travel_scenic where scenicId = '" + scenciId + "'";
                if (productId > 0)
                {
                    sql = "select count(id) as t from t_travel_tickets where productId = " + productId;
                }
                Num = Convert.ToInt16(helper.GetOne(sql));
            }
            catch
            {
                Num = 0;
            }
            return Num;
        }
    }
}

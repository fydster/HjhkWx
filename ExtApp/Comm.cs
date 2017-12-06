using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using com.seascape.tools;

namespace ExtApp.QQ.AI
{
    public class Comm
    {
        public static long app_id = 1106456675;
        public static string AppKey = "NtQVQoys4wSU5v8h";

        public string GetResult(List<para> o, string url)
        {
            
            StringBuilder sb = new StringBuilder();
            foreach (para item in o)
            {
                sb.Append(item.key.ToLower() + "=" + item.value + "&");
            }

            

            string sign = Sign(o).ToUpper();

            //_Facemerge.WriteELog("sign:" + sign);

            string result = PostHttp(url, sb.ToString() + "sign=" + sign);
            //_Facemerge.WriteELog("result:" + result);
            return result;
        }

        public string Sign(List<para> para)
        {
            List<para> result = para.OrderByDescending(a => a.key).ToList();
            result.Reverse();
            StringBuilder sb = new StringBuilder();
            foreach (para item in result)
            {
                sb.Append(item.key.ToLower() + "=" + item.value + "&");
            }
            sb.Append("app_key=" + System.Web.HttpUtility.UrlEncode(AppKey));
            //WriteLog(sb.ToString());
            return com.seascape.tools.BasicTool.MD5(sb.ToString());
        }

        public string webRequest(string url, string data)
        {
            //System.Net.ServicePointManager.Expect100Continue = false;
            string html = null;
            WebRequest req = WebRequest.Create(url);
            req.Method = "POST";
            
            byte[] byteArray = Encoding.UTF8.GetBytes(data);
            req.ContentType = "application/x-www-form-urlencoded";
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

        //body是要传递的参数,格式"roleId=1&uid=2"
        //post的cotentType填写:
        //"application/x-www-form-urlencoded"
        //soap填写:"text/xml; charset=utf-8"
        public static string PostHttp(string url, string body)
        {
            //System.Net.ServicePointManager.Expect100Continue = false;
            string contentType = "application/x-www-form-urlencoded";
            HttpWebRequest httpWebRequest = (HttpWebRequest)WebRequest.Create(url);

            httpWebRequest.ContentType = contentType;
            httpWebRequest.Method = "POST";
            httpWebRequest.Timeout = 20000;
            httpWebRequest.KeepAlive = false;

            byte[] btBodys = Encoding.UTF8.GetBytes(body);
            httpWebRequest.ContentLength = btBodys.Length;
            httpWebRequest.GetRequestStream().Write(btBodys, 0, btBodys.Length);

            HttpWebResponse httpWebResponse = (HttpWebResponse)httpWebRequest.GetResponse();
            StreamReader streamReader = new StreamReader(httpWebResponse.GetResponseStream());
            string responseContent = streamReader.ReadToEnd();

            httpWebResponse.Close();
            streamReader.Close();
            httpWebRequest.Abort();
            httpWebResponse.Close();

            return responseContent;
        }


        public List<para> GetParaList(object o)
        {
            List<para> lp = new List<para>();
            foreach (System.Reflection.PropertyInfo p in o.GetType().GetProperties())
            {
                if (p.GetValue(o, null) != null && p.GetValue(o, null).ToString().Length > 0)
                {
                    lp.Add(new para() { key = p.Name, value = UrlEncode(p.GetValue(o, null).ToString(), Encoding.UTF8) });
                }
            }
            return lp;
        }

        private static string UrlEncode(string temp, Encoding encoding)
        {
            StringBuilder stringBuilder = new StringBuilder();
            for (int i = 0; i < temp.Length; i++)
            {
                string t = temp[i].ToString();
                string k = System.Web.HttpUtility.UrlEncode(t, encoding);
                if (t == k)
                {
                    stringBuilder.Append(t);
                }
                else
                {
                    stringBuilder.Append(k.ToUpper());
                }
            }
            return stringBuilder.ToString();
        }

        /// <summary>
        /// utf8转gb2312
        /// </summary>
        /// <param name="text"></param>
        /// <returns></returns>
        public static string utf8_gb2312(string text)
        {
            //声明字符集   
            System.Text.Encoding utf8, gb2312;
            //utf8   
            utf8 = System.Text.Encoding.GetEncoding("utf-8");
            //gb2312   
            gb2312 = System.Text.Encoding.GetEncoding("gb2312");
            byte[] utf;
            utf = utf8.GetBytes(text);
            utf = System.Text.Encoding.Convert(utf8, gb2312, utf);
            //返回转换后的字符   
            return gb2312.GetString(utf);
        }
    }
}

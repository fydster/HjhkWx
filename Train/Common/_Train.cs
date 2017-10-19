using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net;
using System.IO;
using Newtonsoft.Json;

namespace Train
{
    public class _Train
    {
        public static string channel = "7620F7B2E37449C9";
        public static string key = "991589005d114fd1be5bc0d17ed20737";
        public static string url = "http://openapi.17usoft.net/";

        public string GetResult(train_get o,string method)
        {
            string getUrl = url + o.url + "?";

            train_para tp = new train_para
            {
                key = "channel",
                value = channel
            };
            o.para.Add(tp);

            StringBuilder sb = new StringBuilder();
            foreach (train_para item in o.para)
            {
                sb.Append(item.key.ToLower() + "=" + item.value + "&");
            }

            //WriteLog(sb.ToString());

            string sign = Sign(o.para).ToUpper();

            getUrl = getUrl + sb.ToString() + "sign=" + sign;

            WriteLog(getUrl);

            string result = "";
            if (method == "GET")
            {
                result = com.seascape.tools.BasicTool.webRequest(getUrl);
            }
            else
            {
                result = webRequest(url + o.url, sb.ToString() + "sign=" + sign);
            }
            if (o.url.IndexOf("TrainSearch") == -1)
            {
                WriteLog(result);
            }
            return result;
        }

        public string Sign(List<train_para> para)
        {
            List<train_para> result = para.OrderByDescending(a => a.key).ToList();
            result.Reverse();
            StringBuilder sb = new StringBuilder();
            foreach (train_para item in result)
            {
                sb.Append(item.key.ToLower() + "=" + item.value + "&");
            }
            sb.Append("md5key=" + key);
            //WriteLog(sb.ToString());
            return com.seascape.tools.BasicTool.MD5(sb.ToString());
        }

        public string webRequest(string url, string data)
        {
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

        public void WriteLog(string strMemo)
        {
            string filename =  "D:/HjhkWx/log/train_s_" + DateTime.Now.ToString("yyMMdd") + ".txt";
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
    }
}

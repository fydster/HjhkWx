using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net;
using System.IO;
using Newtonsoft.Json;
using System.Security.Cryptography;

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

      /// <summary>
      /// 加密方法
      /// </summary>
      /// <param name="pToEncrypt"></param>
      /// <param name="sKey"></param>
      /// <returns></returns>
        public string Encrypt(string pToEncrypt)
        {
            DESCryptoServiceProvider des = new DESCryptoServiceProvider();
            //把字符串放到byte数组中
            //原来使用的UTF8编码，我改成Unicode编码了，不行
            byte[] inputByteArray = Encoding.Default.GetBytes(pToEncrypt);
            //byte[]  inputByteArray=Encoding.Unicode.GetBytes(pToEncrypt); 

            //建立加密对象的密钥和偏移量
            //原文使用ASCIIEncoding.ASCII方法的GetBytes方法
            //使得输入密码必须输入英文文本
            des.Key = ASCIIEncoding.ASCII.GetBytes(key);
            des.IV = ASCIIEncoding.ASCII.GetBytes(key);
            //创建其支持存储区为内存的流
            MemoryStream ms = new MemoryStream();
            //将数据流链接到加密转换的流
            CryptoStream cs = new CryptoStream(ms, des.CreateEncryptor(), CryptoStreamMode.Write);
            //Write  the  byte  array  into  the  crypto  stream 
            //(It  will  end  up  in  the  memory  stream) 
            cs.Write(inputByteArray, 0, inputByteArray.Length);
            //用缓冲区的当前状态更新基础数据源或储存库，随后清除缓冲区
            cs.FlushFinalBlock();
            //Get  the  data  back  from  the  memory  stream,  and  into  a  string 
            byte[] EncryptData = (byte[])ms.ToArray();
            return System.Convert.ToBase64String(EncryptData, 0, EncryptData.Length);
        }
    }
}

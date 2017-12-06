using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Web;
using ZXing;

/// <summary>
/// QrCode 的摘要说明
/// </summary>
public class QrCode
{
    public string toCodeImg(string msg, HttpContext c, string fileName)
    {
        BarcodeWriter writer = new BarcodeWriter();
        writer.Format = BarcodeFormat.QR_CODE;
        writer.Options.Hints.Add(EncodeHintType.CHARACTER_SET, "UTF-8");//编码问题
        writer.Options.Hints.Add(
            EncodeHintType.ERROR_CORRECTION,
            ZXing.QrCode.Internal.ErrorCorrectionLevel.H

        );
        const int codeSizeInPixels = 250;   //设置图片长宽
        writer.Options.Height = writer.Options.Width = codeSizeInPixels;
        writer.Options.Margin = 1;//设置边框
        ZXing.Common.BitMatrix bm = writer.Encode(msg);
        Bitmap img = writer.Write(bm);

        string ResultPath = c.Server.MapPath("/source/adCode/") + fileName;
        img.Save(ResultPath, System.Drawing.Imaging.ImageFormat.Jpeg);

        return "/srouce/adCode/" + fileName;
    }

    public string DecodeQrCode(string Imagefilename)
    {
        Bitmap bmp = new Bitmap(Imagefilename);
        BarcodeReader reader = new BarcodeReader();
        reader.Options.CharacterSet = "UTF-8";
        var result = reader.Decode(bmp);
        return (result == null) ? null : result.Text;
    }
}
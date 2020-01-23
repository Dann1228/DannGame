using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Reflection;
using NUnit.Framework;

namespace WebGame.BaseLib.Test
{
    public class UnitTest1 
    {
        
        public class BasicPM
        {
            public string A { set; get; }
            public string B { set; get; }
            public string C { set; get; }
        }

        /// <summary>
        /// 呼叫 Python
        /// </summary>
        [Test]
        [TestCase(new object[] { 1}, "1")]
        [TestCase(new object[] { "12","at","2" }, "14")]
        public void TestMethod1(object[] arr , string expectResultMessage)
        {
            string result = string.Empty;
            string outputText = string.Empty;
            string errorMsg = string.Empty;
            string filePath_python = @"D:\Training\Test_ExchangeRate\Test_ExchangeRate\Test_ExchangeRate.py";
            //string filePath_pythonExe = @"C:\Program Files(x86)\Microsoft Visual Studio\Shared\Python36_64\python.exe";
            string filePath_pythonExe = @"python.exe";
            string arguments = filePath_python;
            foreach (var arg in arr)
            {
                arguments += " "+ arg;
            }
            try
            {
                using (Process process = new Process())
                {
                    process.StartInfo = new ProcessStartInfo(filePath_pythonExe)
                    {
                        Arguments = arguments,
                        UseShellExecute = false,
                        RedirectStandardInput = true,
                        RedirectStandardOutput = true,
                        RedirectStandardError = true,
                        CreateNoWindow = true
                    };

                    process.Start();
                    outputText = process.StandardOutput.ReadToEnd();
                    outputText = outputText.Replace(Environment.NewLine, string.Empty);
                    errorMsg = process.StandardError.ReadToEnd();
                    process.WaitForExit();
                }

            }
            catch (Exception ex)
            {
                expectResultMessage = ex.Message;
            }

            if (!string.IsNullOrWhiteSpace(outputText))
            {
                result = outputText;
            }

            Assert.True(expectResultMessage.Equals(result), string.Format("Should show message {0}, but \"{1}\"", expectResultMessage, result.ToString()));
        }
    }
}

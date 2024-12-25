const axios = require('axios');
const chalk = require('chalk')
const config = require('./config.json');
const UserAgent = require('user-agents');
const userAgentBukanNabiBoy = new UserAgent().toString();

async function runTask(taskIdx) {
  const url = 'https://mt.promptale.io/tasks/taskRun';

  const headers = {
    accept: 'application/json, text/plain, */*',
    'accept-encoding': 'gzip, deflate, br, zstd',
    'accept-language': 'en-US,en;q=0.9',
    authorization: config.bearer,
    'cache-control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'content-length': '14',
    'content-type': 'application/json',
    cookie: 'AWSALBCORS=JcDwfJWafJVOfurmHPCFtmaec06Ds1936f9Evfjrz/p727+G8RAC9G8gDX/DeH2zB2ZC7o0l0I1seNez1LVdQs48E6bo/Xd/jNqtSumT0iGQDauco+Out3r6QBD6',
    expires: '0',
    origin: 'https://mt.promptale.io',
    pragma: 'no-cache',
    priority: 'u=1, i',
    referer: 'https://mt.promptale.io/task',
    'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': userAgentBukanNabiBoy,
  };

  const data = {
    taskIdx: taskIdx,
  };

  try {
    const response = await axios.post(url, data, { headers });
    return response;
  } catch (error) {
    return false;
  }
}
async function completeTask(taskIdx) {
    const url = 'https://mt.promptale.io/tasks/taskComplete';
  
    const headers = {
      accept: 'application/json, text/plain, */*',
      'accept-encoding': 'gzip, deflate, br, zstd',
      'accept-language': 'en-US,en;q=0.9',
      authorization: config.bearer,
      'cache-control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'content-length': '14',
      'content-type': 'application/json',
      cookie: 'AWSALBCORS=JcDwfJWafJVOfurmHPCFtmaec06Ds1936f9Evfjrz/p727+G8RAC9G8gDX/DeH2zB2ZC7o0l0I1seNez1LVdQs48E6bo/Xd/jNqtSumT0iGQDauco+Out3r6QBD6',
      expires: '0',
      origin: 'https://mt.promptale.io',
      pragma: 'no-cache',
      priority: 'u=1, i',
      referer: 'https://mt.promptale.io/task',
      'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'user-agent': userAgentBukanNabiBoy,
    };
  
    const data = {
      taskIdx: taskIdx,
    };
  
    try {
      const response = await axios.post(url, data, { headers });
      console.log(chalk.yellow(`    ${response.data.message}`))
      if(!response.data.success){
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error during task completion:', error.message || error);
      return false;
    }
  }
  

async function getTasks() {
    const url = 'https://mt.promptale.io/tasks';
  
    const headers = {
      accept: 'application/json, text/plain, */*',
      'accept-encoding': 'gzip, deflate, br, zstd',
      'accept-language': 'en-US,en;q=0.9',
      authorization: config.bearer,
      'cache-control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'content-type': 'application/json',
      cookie: 'AWSALBCORS=JcDwfJWafJVOfurmHPCFtmaec06Ds1936f9Evfjrz/p727+G8RAC9G8gDX/DeH2zB2ZC7o0l0I1seNez1LVdQs48E6bo/Xd/jNqtSumT0iGQDauco+Out3r6QBD6',
      expires: '0',
      origin: 'https://mt.promptale.io',
      pragma: 'no-cache',
      priority: 'u=1, i',
      referer: 'https://mt.promptale.io/task',
      'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'user-agent': userAgentBukanNabiBoy,
    };
  
    try {
      const response = await axios.get(url, { headers });
      
      return response.data.data;
    } catch (error) {
      if (error.response) {
        console.error('Error Response Status:', error.response.status);
        console.error('Error Response Data:', error.response.data);
      } else if (error.request) {
        console.error('Error Request:', error.request);
      } else {
        console.error('Error Message:', error.message);
      }
      return [];
    }
  }
  


async function processTasks() {
    const tasks = await getTasks();  
  
    if (tasks.length === 0) {
      console.log('Tidak ada tugas yang ditemukan atau terjadi kesalahan saat mengambil tugas.');
      return;
    }
  
    for (const task of tasks) {
      try {
        console.log(chalk.magenta(`[+] Memproses Task: ID - ${task.taskIdx}, Judul - ${task.taskMainTitle}`));
  
        const run = await runTask(task.taskIdx);
        if(!run){
            console.log(`    Gagal menjalankan task ${task.taskMainTitle}`)
            continue;
        }
        console.log(chalk.cyan(`    Berhasil menjalankan task ${task.taskMainTitle}, menunggu waktu untuk klaim...`))
        
        
        const komplit = await completeTask(task.taskIdx);
        if(!komplit){
            console.log(`    Gagal klaim task ${task.taskMainTitle}`)
            continue;
        }
        console.log(chalk.green(`    Berhasil klaim task ${task.taskMainTitle}`));
      } catch (error) {
        console.error(`    Gagal memproses Task ID: ${task.taskIdx}`);
      }
    }
  }
  
  processTasks()
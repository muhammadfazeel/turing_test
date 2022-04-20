import sequelize from '../models/index.js';
import initModels from "../models/init-models.js";
import seq from 'sequelize';
import { CronJob } from 'cron';
import axios from 'axios';
import { Container } from 'typedi';
import moment from 'moment';
import config from '../config/config.js';

const model = initModels(sequelize);
const logger = Container.get('logger');

const addContributors = (data) => {
    console.log('Add Contributor Function Called');
    return new Promise(async (resolve, reject) => {
        try {
            let contributors = await axios.get(`https://api.github.com/repos/${data.full_name}/contributors?sort=created`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `token ${process.env.token}`
                }
            })
            if (contributors && contributors.data && contributors.data.length) {
                for (let i = 0; i < contributors.data.length; i++) {
                    let commits = await axios.get(`https://api.github.com/repos/${data.full_name}/commits`, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `token ${process.env.token}`
                        }
                    });
                    if (commits && commits.data && commits.data.length) {
                        let sorted = commits.data.sort(function (a, b) {
                            return new Date(b.commit.author.date) - new Date(a.commit.author.date);
                        });
                        let filtered = sorted.filter(x => x.committer !== null)
                        const ids = filtered.map(o => o.committer.id)
                        // console.log(filtered)
                        for (let k = 0; k < filtered.length; k++) {
                            filtered[k].id = filtered[k].committer.id
                        }

                        filtered = filtered.filter(({ id }, index) => !ids.includes(id, index + 1))
                        let arr = [];
                        for (let j = 0; j < filtered.length; j++) {
                            let obj = {
                                node_id: filtered[j].committer.id ? filtered[j].committer.id : filtered[j].author.id,
                                name: filtered[j].committer.login ? filtered[j].committer.login : filtered[j].author.login,
                                contributions: contributors.data[i].contributions,
                                year: moment(filtered[j].commit.author.date).format("YYYY"),
                                day: moment(filtered[j].commit.author.date).format("DD"),
                                month: moment(filtered[j].commit.author.date).format("MM"),
                                RepositoryId: data.id
                            }
                            let checkIfAlreadyExists = await model.Contributor.findOne({ where: { RepositoryId: data.id, node_id: obj.node_id } })
                            if (checkIfAlreadyExists) {
                                checkIfAlreadyExists.set(obj)
                                checkIfAlreadyExists.save()
                            } else {
                                model.Contributor.create(obj)
                            }
                        }
                    }
                }
            }
        } catch (e) {
            logger.error('🔥 error: %o', e);
        }
    })
}

const job1 = new CronJob("0 */1 * * * *", async function () {
    console.log('Cron Job Called')
    try {
        axios.get(`https://api.github.com/orgs/${config.org}/repos`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `token ${process.env.token}`
            }
        }).then(async (response) => {
            response = JSON.parse(JSON.stringify(response.data))
            if (response && response.length) {
                let arr = [];
                for (let i = 0; i < response.length; i++) {
                    arr.push({
                        node_id: response[i].node_id,
                        name: response[i].full_name,
                        org: config.org,
                        repository: response[i].name
                    })
                }
                await model.Repository.bulkCreate(arr, { updateOnDuplicate: ["node_id", "name"] });
                let repos = await model.Repository.findAll({ where: {}, raw: true });
                repos = JSON.parse(JSON.stringify(repos))
                return repos
            }
        }).then(async (repos) => {
            for (let i = 0; i < repos.length; i++) {
                addContributors({ full_name: repos[i].name, id: repos[i].id })
            }
        })

    } catch (e) {
        logger.error('🔥 error: %o', e);
    }
})

job1.start()
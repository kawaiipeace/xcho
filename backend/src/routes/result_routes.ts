import Elysia from "elysia";
import { createResultRequest } from "../../models/create_result_request";
import { results } from "../../db-models/results";
import { randomUUID } from "crypto";
import { t } from "elysia";

const resultRoutes = new Elysia({ 
    prefix : '/results',
    detail : {
        tags : ['result']
    }
})
.post('/create-result', async ({body}:{body:createResultRequest}) =>{
    const nowUtc = new Date();
    const nowThai = new Date(nowUtc.getTime() + 7*60*60*1000);
    const timestampWithTimeZone = new Date(nowThai).toLocaleString("en-US", {
        timeZone: "Asia/Bangkok",
        timeZoneName: "short",
      });
    const newResult = await results.create({
        id : randomUUID(),
        survey_id : body.survey_id,
        respondent_id : body.respondent_id,
        personal_id : body.personal_id,
        status : body.status,
        content_result: body.content_result,
        created_by: body.respondent_id,
        update_by : body.respondent_id,
    });
    return JSON.stringify(newResult);
},
{
    detail : {
        summary : "Submit result by user",
        description : "Post request to create result from user."
    },
    body : t.Object({
        survey_id : t.String(),
        respondent_id : t.String(),
        personal_id : t.String(),
        status : t.Number(),
        content_result : t.String(),
    })
})
.post('/update-result', async ({body}:{body:createResultRequest}) =>{
    const nowUtc = new Date();
    const nowThai = new Date(nowUtc.getTime() + 7*60*60*1000);
    const timestampWithTimeZone = new Date(nowThai).toLocaleString("en-US", {
        timeZone: "Asia/Bangkok",
        timeZoneName: "short",
      });
    const newResult = await results.update({
        survey_id : body.survey_id,
        respondent_id : body.respondent_id,
        personal_id : body.personal_id,
        status : body.status,
        content_result: body.content_result,
        update_by : body.respondent_id,
    },
    {
        where : {
            id : body.id
        }
    }
    );
    return JSON.stringify(newResult);
},
{
    detail : {
        summary : "Update result by user",
        description : "Post request to update result from user."
    },
    body : t.Object({
        survey_id : t.String(),
        respondent_id : t.String(),
        personal_id : t.String(),
        status : t.Number(),
        content_result : t.String(),
    })
})
.get('/get-result-by-survey-id', async (req) =>{
    const surveyId = req.query.id;
    var searchResult : results[] = [];
    searchResult = await results.findAll({
        where:{
            survey_id : surveyId
        }
    })
    return searchResult;
},
{
    detail : {
        summary : "Get result by survey",
        description : "Get request to get result from user by survey id."
    },
    query : t.Object({
        id : t.String({example : '26b64f2a-ec4b-4d05-ac79-62fd92b634bc'})
    })
})
.get('/get-result-by-respondent-id', async (req) =>{
    const respondentId = req.query.id;
    var searchResult : results[] = [];
    searchResult = await results.findAll({
        where:{
            respondent_id : respondentId
        }
    })
    return searchResult;
},
{
    detail : {
        summary : "Get result by respondent id",
        description : "Get request to get result by respondent id."
    },
    query : t.Object({
        id : t.String({example : '511879'})
    })
})
.get('/get-result-by-surv-resp-id', async (req) =>{
    const surveyId = req.query.survey_id;
    const respondentId = req.query.respondent_id;
    var searchResult : results[] = [];
    searchResult = await results.findAll({
        where:{
            survey_id : surveyId,
            respondent_id : respondentId,
        }
    })
    return searchResult;
},
{
    detail : {
        summary : "Get result by survey id and respondent id",
        description : "Get request to get result by survey id and respondent id."
    },
    query : t.Object({
        survey_id : t.String({example : '26b64f2a-ec4b-4d05-ac79-62fd92b634bc'}),
        respondent_id : t.String({example : '511879'}),
    })
})
.get('/get-result-by-personal-id', async (req) =>{
    const personalId = req.query.id;
    var searchResult : results[] = [];
    searchResult = await results.findAll({
        where:{
            personal_id : personalId
        }
    })
    return searchResult;
},
{
    detail : {
        summary : "Get result by personal id",
        description : "Get request to get result by personal id incase of outsider respondent."
    },
    query : t.Object({
        id : t.String({example : '511879'})
    })
})
export default resultRoutes;
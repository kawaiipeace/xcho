--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4 (Debian 16.4-1.pgdg120+1)
-- Dumped by pg_dump version 16.4 (Debian 16.4-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: assignees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assignees (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    survey_id uuid NOT NULL,
    assignee_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_by integer NOT NULL,
    update_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    update_by integer NOT NULL
);


ALTER TABLE public.assignees OWNER TO postgres;

--
-- Name: TABLE assignees; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.assignees IS 'ตารางเก็บข้อมูลผู้ที่จะต้องตอบแบบฟอร์มนั้น ๆ';


--
-- Name: COLUMN assignees.survey_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.assignees.survey_id IS 'id จาก surveys (โครงสร้างแบบสำรวจ)';


--
-- Name: COLUMN assignees.assignee_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.assignees.assignee_id IS 'รหัสพนักงานของผู้ถูก Assign ให้ตอบ';


--
-- Name: COLUMN assignees.created_at; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.assignees.created_at IS 'Timestamp วันและเวลาของการสร้าง';


--
-- Name: COLUMN assignees.created_by; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.assignees.created_by IS 'Stamp ID ผู้สร้าง';


--
-- Name: COLUMN assignees.update_at; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.assignees.update_at IS 'Timestamp วันและเวลาของการปรับปรุง';


--
-- Name: COLUMN assignees.update_by; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.assignees.update_by IS 'Stamp ID ผู้ปรับปรุง';


--
-- Name: history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.history (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    survey_id uuid NOT NULL,
    result_id uuid,
    status_before smallint NOT NULL,
    status_after smallint NOT NULL,
    request_uri character varying NOT NULL COLLATE pg_catalog."th_TH",
    request_data json,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_by integer NOT NULL
);


ALTER TABLE public.history OWNER TO postgres;

--
-- Name: TABLE history; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.history IS 'ตารางเก็บข้อมูลประวัติการใช้งานของระบบ';


--
-- Name: COLUMN history.survey_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.history.survey_id IS 'id จาก surveys (โครงสร้างแบบสำรวจ)';


--
-- Name: COLUMN history.result_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.history.result_id IS 'id คำตอบ';


--
-- Name: COLUMN history.status_before; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.history.status_before IS 'สถานะก่อนเปลี่ยนแปลงของ survey';


--
-- Name: COLUMN history.status_after; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.history.status_after IS 'สถานะหลังเปลี่ยนแปลงของ survey';


--
-- Name: COLUMN history.request_uri; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.history.request_uri IS 'uri ที่ frontend ยิงไปหา backend';


--
-- Name: COLUMN history.request_data; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.history.request_data IS 'request body';


--
-- Name: COLUMN history.created_at; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.history.created_at IS 'Timestamp วันและเวลาของการสร้าง';


--
-- Name: COLUMN history.created_by; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.history.created_by IS 'Stamp ID ผู้สร้าง';


--
-- Name: master_status; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.master_status (
    status_id smallint NOT NULL,
    status_detail character varying NOT NULL COLLATE pg_catalog."th_TH"
);


ALTER TABLE public.master_status OWNER TO postgres;

--
-- Name: TABLE master_status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.master_status IS 'ตารางเก็บข้อมูลสถานะของแบบสอบถาม';


--
-- Name: COLUMN master_status.status_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.master_status.status_id IS 'รหัสสถานะ
(เลข 1 นำหน้าเป็นสถานะ flow อนุมัติสำหรับ survey)
10 บันทึกร่าง (แก้ไขแบบฟอร์มได้)
11 รออนุมัติ
12 อนุมัติสำเร็จ
13 ตีกลับแก้ไข (แก้ไขแบบฟอร์มได้)
(เลข 2 นำหน้าเป็น flow การเผยแพร่ survey) (ยังแก้ไขวันที่เผยแพร่กับ assignee ได้)
20 รอเผยแพร่
21 เผยแพร่แล้ว
22 ระงับเผยแพร่
23 เต็มโควต้า
24 หมดอายุ
(เลข 3 นำหน้าเป็นสถานะสำหรับคำตอบ)
30 ยังไม่ตอบหรือร่างคำตอบ
31 ตอบแล้ว
32 ตอบไม่ทัน
33 ตอบแล้ว/แก้ไขคำตอบ
90 ถูกลบ';


--
-- Name: COLUMN master_status.status_detail; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.master_status.status_detail IS 'คำอธิบายของสถานะ';


--
-- Name: results; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.results (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    survey_id uuid NOT NULL,
    respondent_id integer NOT NULL,
    personal_id character varying NOT NULL COLLATE pg_catalog."th_TH",
    status smallint NOT NULL,
    content_result json,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_by integer NOT NULL,
    update_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    update_by integer NOT NULL
);


ALTER TABLE public.results OWNER TO postgres;

--
-- Name: TABLE results; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.results IS 'ตารางเก็บข้อมูลคำตอบของแบบสำรวจ รวมไปถึงสถานะตอบ ยังไม่ตอบ';


--
-- Name: COLUMN results.survey_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.results.survey_id IS 'id จาก surveys (โครงสร้างแบบสำรวจ)';


--
-- Name: COLUMN results.respondent_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.results.respondent_id IS 'รหัสพนักงานของผู้ตอบแบบสำรวจ (บุคคลภายนอกเป็น -1)';


--
-- Name: COLUMN results.personal_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.results.personal_id IS 'รหัสบัตรประชาชนในกรณีบุคคลภายนอกเข้าตอบ';


--
-- Name: COLUMN results.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.results.status IS 'โยงกับtable master_status 30 ขึ้นไป';


--
-- Name: COLUMN results.content_result; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.results.content_result IS 'โครงสร้างของคำตอบเป็น JSON';


--
-- Name: COLUMN results.created_at; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.results.created_at IS 'Timestamp วันและเวลาของการสร้าง';


--
-- Name: COLUMN results.created_by; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.results.created_by IS 'Stamp ID ผู้สร้าง';


--
-- Name: COLUMN results.update_at; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.results.update_at IS 'Timestamp วันและเวลาของการปรับปรุง';


--
-- Name: COLUMN results.update_by; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.results.update_by IS 'Stamp ID ผู้ปรับปรุง';


--
-- Name: return; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.return (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    survey_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_by integer NOT NULL
);


ALTER TABLE public.return OWNER TO postgres;

--
-- Name: TABLE return; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.return IS 'ตารางเก็บ comment การตีกลับเฉพาะสถานะ 13';


--
-- Name: COLUMN return.survey_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.return.survey_id IS 'id จาก surveys (โครงสร้างแบบสำรวจ)';


--
-- Name: COLUMN return.created_at; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.return.created_at IS 'Timestamp วันและเวลาของการสร้าง';


--
-- Name: COLUMN return.created_by; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.return.created_by IS 'Stamp ID ผู้สร้าง';


--
-- Name: role_approvers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role_approvers (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    role_id character varying NOT NULL COLLATE pg_catalog."th_TH",
    role_name character varying NOT NULL COLLATE pg_catalog."th_TH"
);


ALTER TABLE public.role_approvers OWNER TO postgres;

--
-- Name: TABLE role_approvers; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.role_approvers IS 'ตารางเก็บข้อมูลตำแหน่งของผู้มีสิทธิ์อนุมัติ';


--
-- Name: COLUMN role_approvers.role_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.role_approvers.role_id IS 'ระดับตำแหน่งพนักงานตาม hr platform';


--
-- Name: COLUMN role_approvers.role_name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.role_approvers.role_name IS 'ชื่อตำแหน่งพนักงาน';


--
-- Name: survey; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.survey (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    survey_title character varying NOT NULL COLLATE pg_catalog."th_TH",
    creator_id integer NOT NULL,
    publish_date timestamp with time zone NOT NULL,
    expire_date timestamp with time zone NOT NULL,
    qr_code text NOT NULL,
    short_link text NOT NULL,
    status smallint NOT NULL,
    approver_id integer,
    is_outsider_allowed boolean NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_by integer NOT NULL,
    update_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    update_by integer NOT NULL
);


ALTER TABLE public.survey OWNER TO postgres;

--
-- Name: TABLE survey; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.survey IS 'ตารางเก็บข้อมูลโครงสร้างของแบบสำรวจ';


--
-- Name: COLUMN survey.survey_title; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.survey.survey_title IS 'ชื่อแบบสำรวจ';


--
-- Name: COLUMN survey.creator_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.survey.creator_id IS 'รหัสพนักงาน';


--
-- Name: COLUMN survey.publish_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.survey.publish_date IS 'วันและเวลาเผยแพร่แบบฟอร์ม';


--
-- Name: COLUMN survey.expire_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.survey.expire_date IS 'วันและเวลาที่หมดอายุของแบบฟอร์ม';


--
-- Name: COLUMN survey.qr_code; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.survey.qr_code IS 'เก็บภาพ QR Code';


--
-- Name: COLUMN survey.short_link; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.survey.short_link IS 'เก็บลิงค์สั้นของ Survey';


--
-- Name: COLUMN survey.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.survey.status IS 'สถานะของโครงสร้างในแบบสำรวจ';


--
-- Name: COLUMN survey.approver_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.survey.approver_id IS 'รหัสพนักงานของผู้อนุมัติ';


--
-- Name: COLUMN survey.is_outsider_allowed; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.survey.is_outsider_allowed IS 'บุคคลภายนอกตอบแบบสอบถามได้หรือไม่';


--
-- Name: COLUMN survey.created_at; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.survey.created_at IS 'Timestamp วันและเวลาของการสร้าง';


--
-- Name: COLUMN survey.created_by; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.survey.created_by IS 'Stamp ID ผู้สร้าง';


--
-- Name: COLUMN survey.update_at; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.survey.update_at IS 'Timestamp วันและเวลาของการปรับปรุง';


--
-- Name: COLUMN survey.update_by; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.survey.update_by IS 'Stamp ID ผู้ปรับปรุง';


--
-- Data for Name: assignees; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.assignees (id, survey_id, assignee_id, created_at, created_by, update_at, update_by) FROM stdin;
\.


--
-- Data for Name: history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.history (id, survey_id, result_id, status_before, status_after, request_uri, request_data, created_at, created_by) FROM stdin;
\.


--
-- Data for Name: master_status; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.master_status (status_id, status_detail) FROM stdin;
\.


--
-- Data for Name: results; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.results (id, survey_id, respondent_id, personal_id, status, content_result, created_at, created_by, update_at, update_by) FROM stdin;
\.


--
-- Data for Name: return; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.return (id, survey_id, created_at, created_by) FROM stdin;
\.


--
-- Data for Name: role_approvers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.role_approvers (id, role_id, role_name) FROM stdin;
\.


--
-- Data for Name: survey; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.survey (id, survey_title, creator_id, publish_date, expire_date, qr_code, short_link, status, approver_id, is_outsider_allowed, created_at, created_by, update_at, update_by) FROM stdin;
\.


--
-- Name: assignees assignees_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignees
    ADD CONSTRAINT assignees_pk PRIMARY KEY (id);


--
-- Name: history history_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.history
    ADD CONSTRAINT history_pk PRIMARY KEY (id);


--
-- Name: master_status master_status_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.master_status
    ADD CONSTRAINT master_status_pk PRIMARY KEY (status_id);


--
-- Name: results results_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.results
    ADD CONSTRAINT results_pk PRIMARY KEY (id);


--
-- Name: return return_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.return
    ADD CONSTRAINT return_pk PRIMARY KEY (id);


--
-- Name: role_approvers role_approvers_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_approvers
    ADD CONSTRAINT role_approvers_pk PRIMARY KEY (id);


--
-- Name: survey survey_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.survey
    ADD CONSTRAINT survey_pk PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--


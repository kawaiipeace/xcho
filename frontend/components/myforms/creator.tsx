'use client';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState, useRef, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaRegTrashCan, FaQrcode, FaEye, FaUserPlus, FaWpforms, FaRegShareFromSquare, FaLocationCrosshairs, FaXmark, FaCircleInfo } from "react-icons/fa6";
import { IRootState } from '@/store';
import { IoDuplicateSharp } from "react-icons/io5";
import { MdMoreHoriz, MdDashboard, MdDeleteForever, MdHelpOutline, MdHelp, MdManageAccounts, MdOutlineClose, MdSearch } from "react-icons/md";
import { getTranslation } from '@/i18n';
import { useContextMenu } from 'mantine-contextmenu';
import { useMediaQuery, usePagination } from '@mantine/hooks';
import sortBy from 'lodash/sortBy';
import Dropdown from '@/components/dropdown';
import moment from 'moment';
import survey_record from '@/public/assets/employeedummy.json';
import Tippy from '@tippyjs/react';
import Link from 'next/link';
import { Tab } from '@headlessui/react';
import '@mantine/core/styles.layer.css';
import 'mantine-datatable/styles.layer.css';
import 'mantine-contextmenu/styles.layer.css';
import 'moment/locale/th';
import 'tippy.js/dist/tippy.css';
// import 'survey-core/defaultV2.css'
import "survey-creator-core/survey-creator-core.css";
import IconHome from '@/components/icon/icon-home';
import IconPhone from '@/components/icon/icon-phone';
import IconSettings from '@/components/icon/icon-settings';
import IconUser from '@/components/icon/icon-user';
import Image from 'next/image'
import * as XLSX from 'xlsx';
import '@mantine/core/styles.layer.css';
import 'mantine-datatable/styles.layer.css';
import 'mantine-contextmenu/styles.layer.css';
import 'moment/locale/th';
import 'tippy.js/dist/tippy.css';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { Dialog, Transition } from '@headlessui/react';
import Swal from 'sweetalert2';
import 'survey-core/survey-core.css';

import IconSearch from '@/components/icon/icon-search';

import { ICreatorOptions, editorLocalization, DefaultFonts } from "survey-creator-core";
import { SurveyCreatorComponent, SurveyCreator } from "survey-creator-react";
// import "survey-creator-core/i18n/thai";

moment.locale('th');
const rowData = survey_record;
const col = ['id', 'Target_ID', 'Target_Name', 'Target_Position', 'Target_Sector'];
const itemsPerPage = 3; // สำหรับ Pagination แบบ Grid View
// editorLocalization.currentLocale = "th";

DefaultFonts.push(
    "IBM_plex, monospace"
);

const defaultCreatorOptions: ICreatorOptions = {
    showDesignerTab: true,
    showTestSurveyTab: true,
    showLogicTab: true,
    showTranslationTab: false,
    showJSONEditorTab: false,
    showThemeTab: true
};

const end_publish_default = moment().add(30, 'days').startOf('day').toDate();


export default function Creator(props: { json?: Object, options?: ICreatorOptions }) {
    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const [isMounted, setIsMounted] = useState(false);
    const [isInternalForm, setIsInternalForm] = useState(true);

    const handleInternalFormChange = () => {
        setIsInternalForm(true);
    };

    const handleExternalFormChange = () => {
        setIsInternalForm(false);
    };

    useEffect(() => {
        setIsMounted(true);
        const defaultInternalForm = document.querySelector('input[name="internal_form"]:checked');
        if (defaultInternalForm) {
            setIsInternalForm(true);
        }
    }, []);

    const { showContextMenu } = useContextMenu();
    const isTouch = useMediaQuery('(pointer: coarse)');
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState(sortBy(rowData, 'id'));
    const [recordsData, setRecordsData] = useState(initialRecords);
    const [value, setValue] = useState<any>('list');
    const tableRef = useRef(null);
    const { t, i18n } = getTranslation();
    const dispatch = useDispatch();
    const [start_publish, set_start_publish] = useState<any>('today');
    const [end_publish, set_end_publish] = useState<any>(end_publish_default);
    const [isAlertVisible, setIsAlertVisible] = useState(true);
    const [TypePublishModel, setTypePublishModel] = useState(false);
    const [AddManageModal, setAddManageModal] = useState(false);
    const [AddTargetModal, setAddTargetModal] = useState(false);
    const [selectedRecords, setSelectedRecords] = useState<any[]>([]);

    const handleCloseAlert = () => {
        setIsAlertVisible(false);
    };

    const showSweetAlert = async (type: number) => {
        // 10 = บันทึกร่าง
        if (type === 10) {
            const toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
            });
            toast.fire({
                icon: 'success',
                html: '<p> บันทึกร่างเรียบร้อย</p>',
                padding: '10px 20px',
            });
        }

        // 20 = บันทึกและเผยแพร่
        if (type === 20) {
            Swal.fire({
                icon: 'warning',
                title: 'บันทึกและเผยแพร่แบบฟอร์มหรือไม่?',
                showCancelButton: true,
                cancelButtonText: 'ยกเลิก',
                confirmButtonText: 'ยืนยัน',
                padding: '2em',
                customClass: {
                    popup: 'sweet-alerts'
                },
            }).then((result) => {
                if (result.value) {
                    Swal.fire({
                        title: 'บันทึกและเผยแพร่สำเร็จ!',
                        imageUrl: '/assets/images/logo.svg',
                        imageWidth: 224,
                        imageHeight: 'auto',
                        imageAlt: 'QR Code',
                        text: 'https://xcho.pea.co.th/abcdefg1',
                        confirmButtonText: 'กลับสู่หน้าหลัก',
                        customClass: {
                            popup: 'sweet-alerts'
                        },
                    });
                }
                if (result.value == false) {
                    Swal.fire({
                        title: 'อีหยังว่ะ',
                        text: 'https://xcho.pea.co.th/abcdefg1',
                        confirmButtonText: 'กลับสู่หน้าหลัก',
                        customClass: {
                            popup: 'sweet-alerts'
                        },
                    });
                }
            });
        }
    }

    {/* Select จำนวนหน้า สำหรับใช้ใน Grid View */ }
    const pageSize_select = [
        { value: 10, label: '10' },
        { value: 20, label: '20' },
        { value: 30, label: '30' },
        { value: 50, label: '50' },
        { value: 100, label: '100' },
    ];

    {/* Pagination สำหรับใช้ใน Grid View */ }
    const total = Math.ceil(rowData.length / pageSize);
    const pagination = usePagination({
        total,
        initialPage: 1,
        onChange(page) {
            const start = (page - 1) * pageSize;
            const end = start + pageSize;
            setRecordsData(rowData.slice(start, end));
            console.log(start);
        },
    });

    const colorBadgeStatus = (Status: unknown) => {
        if (typeof Status === 'string') {
            if (Status === 'ยังไม่ตอบ') {
                return 'info';
            } else if (Status === 'ตอบแล้ว') {
                return 'success';
            } else if (Status === 'สิ้นสุดแล้ว') {
                return 'danger';
            }
        }
        return '';
    };

    const showStatus = (Status: any) => {
        return Status;
    }

    const actionStatusList = (id: any, Status: any) => {
        return <div className="mx-auto flex w-max items-center gap-2">
            <Tippy trigger="mouseenter focus" content='ลบรายการ'>
                <button type="button" data-trigger="mouseenter" className="btn btn-outline-danger w-8 h-8 p-0 rounded-full">
                    <Link href={"/myforms/manage/" + id}>
                        <FaRegTrashCan className="h-4 w-4 " />
                    </Link>
                </button>
            </Tippy>
        </div>;
    };

    const actionStatusGrid = (id: any, Status: any) => {
        return <div className="mx-auto flex w-max items-center gap-2">
            {/* ปุ่มดูหรือแก้ไข */}
            <Link href={"/myforms/result/" + id}>
                <div className="group relative flex justify-center items-center text-amber-50 text-sm font-bold">
                    <div className="absolute opacity-0 group-hover:opacity-100 group-hover:-translate-y-[150%] -translate-y-[300%] duration-500 group-hover:delay-500 skew-y-[20deg] group-hover:skew-y-0 shadow-md">
                        <div className="rounded-md bg-white group-hover:opacity-0 group-hover:scale-[115%] group-hover:delay-700 duration-500 w-full h-full absolute top-0 left-0">
                            <div className="border-b border-r border-white bg-white absolute bottom-0 translate-y-1/2 left-1/2 translate-x-full rotate-45 p-1">
                            </div>
                        </div>
                    </div>
                    <div className="shadow-md flex items-center group-hover:gap-2 bg-gradient-to-br from-amber-500 to-amber-400 p-3 rounded-full cursor-pointer duration-300">
                        <svg
                            fill="none"
                            viewBox="0 0 512 512"
                            height="20px"
                            width="20px"
                            xmlns="http://www.w3.org/2000/svg"
                            className="fill-amber-50"
                        >
                            <path
                                stroke-linejoin="round"
                                stroke-linecap="round"
                                d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z"
                            ></path>
                        </svg>
                        <span className="text-[0px] group-hover:text-sm duration-300">ดูหรือแก้ไขฟอร์ม</span>
                    </div>
                </div>
            </Link>
            {/* ปุ่มแสดงผลลัพธ์ (ตาราง) */}
            <Link href={"/incoming/pdf_answered/" + id}>
                <div className="group relative flex justify-center items-center text-emerald-50 text-sm font-bold">
                    <div className="absolute opacity-0 group-hover:opacity-100 group-hover:-translate-y-[150%] -translate-y-[300%] duration-500 group-hover:delay-500 skew-y-[20deg] group-hover:skew-y-0 shadow-md">
                        <div className="rounded-md bg-white group-hover:opacity-0 group-hover:scale-[115%] group-hover:delay-700 duration-500 w-full h-full absolute top-0 left-0">
                            <div className="border-b border-r border-white bg-white absolute bottom-0 translate-y-1/2 left-1/2 translate-x-full rotate-45 p-1">
                            </div>
                        </div>
                    </div>
                    <div className="shadow-md flex items-center group-hover:gap-2 bg-gradient-to-br from-emerald-600 to-emerald-500 p-3 rounded-full cursor-pointer duration-300">
                        <svg
                            fill="none"
                            viewBox="0 0 576 512"
                            height="20px"
                            width="20px"
                            xmlns="http://www.w3.org/2000/svg"
                            className="fill-sky-50"
                        >
                            <path
                                stroke-linejoin="round"
                                stroke-linecap="round"
                                d="M0 96C0 60.7 28.7 32 64 32l448 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM128 288a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm32-128a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM128 384a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm96-248c-13.3 0-24 10.7-24 24s10.7 24 24 24l224 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-224 0zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24l224 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-224 0zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24l224 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-224 0z"
                            ></path>
                        </svg>
                        <span className="text-[0px] group-hover:text-sm duration-300">ตารางผลลัพธ์</span>
                    </div>
                </div>
            </Link>
            {/* ปุ่มดังโงะ (อื่น ๆ) */}
            <div className="flex dropdown">
                <Dropdown
                    btnClassName="btn btn-info w-11 h-11 p-0 rounded-full dropdown-toggle"
                    button={
                        <>
                            <MdMoreHoriz className="h-7 w-7 " />
                        </>
                    }
                >
                    <ul className="!min-w-[170px]">
                        <li>
                            <Link className="inline-block" href={"/myforms/dashboard/" + id}>
                                <button type="button" className="text-center inline-flex items-center">
                                    <MdDashboard className="h-5 w-5 ltr:mr-2 rtl:ml-2" />
                                    {t('แดชบอร์ด')}
                                </button>
                            </Link>
                        </li>
                        <li>
                            <button type="button" className="text-center inline-flex items-center">
                                <FaEye className="h-5 w-5 ltr:mr-2 rtl:ml-2" />
                                {t('เผยแพร่')}
                            </button>
                        </li>
                        <li>
                            <button type="button" className="text-center inline-flex items-center">
                                <FaQrcode className="h-5 w-5 ltr:mr-2 rtl:ml-2" />
                                {t('ลิงก์/QR Code')}
                            </button>
                        </li>
                        <li>
                            <button type="button" className="text-center inline-flex items-center">
                                <IoDuplicateSharp className="h-5 w-5 ltr:mr-2 rtl:ml-2" />
                                {t('ทำซ้ำ')}
                            </button>
                        </li>
                        <li>
                            <button type="button" className="text-danger text-center inline-flex items-center" onClick={() => exportTable('pdf')}>
                                <MdDeleteForever className="h-5 w-5 ltr:mr-2 rtl:ml-2" />
                                {t('ลบแบบฟอร์ม')}
                            </button>
                        </li>
                    </ul>
                </Dropdown>
            </div>
        </div>;
    };

    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'id',
        direction: 'asc',
    });

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsData([...initialRecords.slice(from, to)]);
    }, [page, pageSize, initialRecords]);

    useEffect(() => {
        setInitialRecords(() => {
            return rowData.filter((item: any) => {
                return (
                    // item.id.toString().includes(search.toLowerCase()) ||
                    item.Target_ID.toLowerCase().includes(search.toLowerCase()) ||
                    item.Target_Name.toLowerCase().includes(search.toLowerCase()) ||
                    item.Target_Position.toLowerCase().includes(search.toLowerCase()) ||
                    item.Target_Sector.toLowerCase().includes(search.toLowerCase())
                );
            });
        });
    }, [search]);

    useEffect(() => {
        const data = sortBy(initialRecords, sortStatus.columnAccessor);
        setInitialRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
        setPage(1);
    }, [sortStatus]);

    const formatDate = (date: any) => {
        if (date) {
            return moment(date).add(543, 'year').format('LL');
        }
        return '';
    };

    const exportTable = (type: any) => {
        let columns: any = col;
        let records = rowData;
        let filename = 'Xcho - ระบบจัดการแบบฟอร์ม';

        let newVariable: any;
        newVariable = window.navigator;

        if (type === 'csv') {
            let coldelimiter = ';';
            let linedelimiter = '\n';
            let result = columns
                .map((d: any) => {
                    return capitalize(d);
                })
                .join(coldelimiter);
            result += linedelimiter;
            records.map((item: any) => {
                columns.map((d: any, index: any) => {
                    if (index > 0) {
                        result += coldelimiter;
                    }
                    let val = item[d] ? item[d] : '';
                    result += val;
                });
                result += linedelimiter;
            });

            if (result == null) return;
            if (!result.match(/^data:text\/csv/i) && !newVariable.msSaveOrOpenBlob) {
                var data = 'data:application/csv;charset=utf-8,' + encodeURIComponent(result);
                var link = document.createElement('a');
                link.setAttribute('href', data);
                link.setAttribute('download', filename + '.csv');
                link.click();
            } else {
                var blob = new Blob([result]);
                if (newVariable.msSaveOrOpenBlob) {
                    newVariable.msSaveBlob(blob, filename + '.csv');
                }
            }
        } else if (type === 'pdf') {
            var rowhtml = '<p>' + filename + '</p>';
            rowhtml +=
                '<table style="width: 100%; " cellpadding="0" cellcpacing="0"><thead><tr style="color: #515365; background: #eff5ff; -webkit-print-color-adjust: exact; print-color-adjust: exact; "> ';
            columns.map((d: any) => {
                rowhtml += '<th>' + capitalize(d) + '</th>';
            });
            rowhtml += '</tr></thead>';
            rowhtml += '<tbody>';
            records.map((item: any) => {
                rowhtml += '<tr>';
                columns.map((d: any) => {
                    let val = item[d] ? item[d] : '';
                    rowhtml += '<td>' + val + '</td>';
                });
                rowhtml += '</tr>';
            });
            rowhtml +=
                '<style>body {font-family:Arial; color:#495057;}p{text-align:center;font-size:18px;font-weight:bold;margin:15px;}table{ border-collapse: collapse; border-spacing: 0; }th,td{font-size:12px;text-align:left;padding: 4px;}th{padding:8px 4px;}tr:nth-child(2n-1){background:#f7f7f7; }</style>';
            rowhtml += '</tbody></table>';
            var winPrint: any = window.open('', '', 'left=0,top=0,width=1000,height=600,toolbar=0,scrollbars=0,status=0');
            winPrint.document.write('<title>Print</title>' + rowhtml);
            winPrint.document.close();
            winPrint.focus();
            winPrint.print();
        } else if (type === 'excel') {
            /* Create worksheet from HTML DOM TABLE */
            const wb = XLSX.utils.table_to_book(tableRef.current);

            /* Export to file (start a download) */
            XLSX.writeFile(wb, "Xcho.xlsx");
        }
    };

    const capitalize = (text: any) => {
        return text
            .replace('_', ' ')
            .replace('-', ' ')
            .toLowerCase()
            .split(' ')
            .map((s: any) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' ');
    };

    let [creator, setCreator] = useState<SurveyCreator>();

    if (!creator) {
        creator = new SurveyCreator(props.options || defaultCreatorOptions);
        creator.saveSurveyFunc = (no: number, callback: (num: number, status: boolean) => void) => {
            console.log(JSON.stringify(creator?.JSON));
            callback(no, true);
        };
        setCreator(creator);
    }

    creator.JSON = props.json;

    return (
        <div className="mb-5">
            {isAlertVisible && (
                <div className="flex items-center p-3.5 rounded text-info bg-info-light dark:bg-info-dark-light">
                    <span className="ltr:pr-2 rtl:pl-2">
                        <strong className="ltr:mr-1 rtl:ml-1">ระบบจะบันทึกร่างให้อัตโนมัติ</strong>วางใจได้
                    </span>
                    <button type="button" className="ltr:ml-auto rtl:mr-auto hover:opacity-80" onClick={handleCloseAlert}>
                        <FaXmark className="h-4 w-4" />
                    </button>
                </div>
            )}
            {isMounted && (
                <Tab.Group>
                    <Tab.List className="mb-5 mt-3 grid grid-cols-4 gap-2 rtl:space-x-reverse sm:flex sm:flex-wrap sm:justify-start sm:space-x-3">
                        <Tab as={Fragment}>
                            {({ selected }) => (
                                <button
                                    className={`${selected ? '!bg-primary text-white !outline-none' : ''}
                                                    flex flex-col items-center justify-center rounded-lg bg-[#f1f2f3] p-7 py-3 hover:!bg-primary hover:text-white hover:shadow-[0_5px_15px_0_rgba(0,0,0,0.30)] dark:bg-[#191e3a]`}
                                >
                                    <FaWpforms className="mb-1 h-5 w-5" />
                                    แบบสำรวจ
                                </button>
                            )}
                        </Tab>
                        <Tab as={Fragment}>
                            {({ selected }) => (
                                <button
                                    className={`${selected ? '!bg-primary text-white !outline-none' : ''}
                                                    flex flex-col items-center justify-center rounded-lg bg-[#f1f2f3] p-7 py-3 hover:!bg-primary hover:text-white hover:shadow-[0_5px_15px_0_rgba(0,0,0,0.30)] dark:bg-[#191e3a]`}
                                >
                                    <MdManageAccounts className="mb-1 h-5 w-5" />
                                    ผู้จัดการ
                                </button>
                            )}
                        </Tab>
                        <Tab as={Fragment}>
                            {({ selected }) => (
                                <button
                                    className={`${selected ? '!bg-primary text-white !outline-none' : ''}
                                                    flex flex-col items-center justify-center rounded-lg bg-[#f1f2f3] p-7 py-3 hover:!bg-primary hover:text-white hover:shadow-[0_5px_15px_0_rgba(0,0,0,0.30)] dark:bg-[#191e3a]`}
                                >
                                    <FaRegShareFromSquare className="mb-1 h-5 w-5" />
                                    การเผยแพร่
                                </button>
                            )}
                        </Tab>
                    </Tab.List>
                    <Tab.Panels>
                        <Tab.Panel>
                            <div className="active" style={{ height: "120vh", width: "100%" }}>
                                <SurveyCreatorComponent creator={creator} />
                            </div>
                        </Tab.Panel>
                        <Tab.Panel>
                            <div className="panel mt-6">
                                <div className="mb-4.5 flex flex-col justify-between gap-5 md:flex-row md:items-center">
                                    <div className="flex flex-wrap items-center">
                                        <h2 className="text-xl">{t('ผู้จัดการแบบสำรวจ')}</h2>
                                    </div>
                                    <div className='flex flex-wrap items-end'>
                                        <button type="button" onClick={() => setAddManageModal(true)} className="btn btn-primary m-1 p-2">
                                            <span>
                                                <FaUserPlus className="h-5 w-5 ltr:mr-1 rtl:ml-1" />
                                            </span>
                                            &nbsp;{t('เพิ่มผู้จัดการ')}
                                        </button>
                                        <Transition appear show={AddManageModal} as={Fragment}>
                                            <Dialog as="div" open={AddManageModal} onClose={() => setAddManageModal(true)}>
                                                <Transition.Child
                                                    as={Fragment}
                                                    enter="ease-out duration-300"
                                                    enterFrom="opacity-0"
                                                    enterTo="opacity-100"
                                                    leave="ease-in duration-200"
                                                    leaveFrom="opacity-100"
                                                    leaveTo="opacity-0"
                                                >
                                                    <div className="fixed inset-0" />
                                                </Transition.Child>
                                                <div className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
                                                    <div className="flex items-start justify-center min-h-screen px-4">
                                                        <Transition.Child
                                                            as={Fragment}
                                                            enter="ease-out duration-300"
                                                            enterFrom="opacity-0 scale-95"
                                                            enterTo="opacity-100 scale-100"
                                                            leave="ease-in duration-200"
                                                            leaveFrom="opacity-100 scale-100"
                                                            leaveTo="opacity-0 scale-95"
                                                        >
                                                            <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-5xl my-8 text-black dark:text-white-dark">
                                                                <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                                                    <h5 className="font-bold text-lg">เพิ่มผู้จัดการ</h5>
                                                                    <button onClick={() => setAddManageModal(false)} type="button" className="text-white-dark hover:text-dark">
                                                                        <MdOutlineClose />
                                                                    </button>
                                                                </div>
                                                                <div className="p-5">
                                                                    {/* Panel ค้นหาพนักงานผู้จัดการ */}
                                                                    <div className="panel">
                                                                        <div className="mb-4.5 flex flex-col justify-between gap-5 md:flex-row md:items-center">
                                                                            <div className="flex items-center">
                                                                                <h2 className="text-xl">{t('ค้นหาชื่อพนักงาน')}</h2>
                                                                            </div>
                                                                        </div>
                                                                        <form>
                                                                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-5">
                                                                                <input type="text" placeholder="รหัสพนักงานหรือชื่อ" className="form-input lg:col-span-2" />
                                                                                <input type="text" placeholder="ตำแหน่ง" className="form-input" />
                                                                                <input type="text" placeholder="สังกัด" className="form-input" />
                                                                            </div>
                                                                            <div className="flex justify-center item-center">
                                                                                <button type="button" className="btn btn-primary">
                                                                                    <MdSearch className="w-4 h-4 mr-1" />
                                                                                    {t('ค้นหา')}
                                                                                </button>
                                                                            </div>
                                                                        </form>
                                                                    </div>

                                                                    {/* Panel รายชื่อเตรียมเพิ่ม */}
                                                                    <div className="panel mt-5">
                                                                        <div className="mb-4.5 flex flex-col justify-between gap-5 md:flex-row md:items-center">
                                                                            <div className="flex flex-wrap items-center">
                                                                                <h2 className="text-xl">{t('รายการข้อมูล')}</h2>
                                                                            </div>
                                                                        </div>
                                                                        <div className="datatables">
                                                                            <DataTable
                                                                                tableRef={tableRef}
                                                                                highlightOnHover
                                                                                striped
                                                                                noRecordsText="ไม่พบข้อมูล"
                                                                                className="table-hover whitespace-nowrap"
                                                                                textSelectionDisabled={isTouch}
                                                                                records={recordsData}
                                                                                selectedRecords={selectedRecords}
                                                                                onSelectedRecordsChange={setSelectedRecords}
                                                                                onRowContextMenu={({ event }) =>
                                                                                    showContextMenu([])(event)}
                                                                                columns={[
                                                                                    { accessor: 'Target_ID', title: 'รหัสพนักงาน', sortable: true },
                                                                                    { accessor: 'Target_Name', title: 'ชื่อ-นามสกุล', sortable: true },
                                                                                    { accessor: 'Target_Position', title: 'ตำแหน่ง', sortable: true },
                                                                                    { accessor: 'Target_Sector', title: 'สังกัด', sortable: true },
                                                                                ]}
                                                                                totalRecords={initialRecords.length}
                                                                                recordsPerPage={pageSize}
                                                                                page={page}
                                                                                onPageChange={(p) => setPage(p)}
                                                                                sortStatus={sortStatus}
                                                                                onSortStatusChange={setSortStatus}
                                                                                minHeight={200}
                                                                                paginationText={({ from, to, totalRecords }) => `แสดงจาก  ${from} ถึง ${to} จากทั้งหมด ${totalRecords} รายการ`}
                                                                                paginationActiveBackgroundColor="grape"
                                                                                loadingText="กำลังโหลด ใจเย็น ๆ..."
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex justify-center items-center mt-8">
                                                                        <button onClick={() => setAddManageModal(false)} type="button" className="btn btn-outline-danger">
                                                                            ยกเลิก
                                                                        </button>
                                                                        <button onClick={() => setAddManageModal(false)} type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4">
                                                                            เพิ่มรายการ
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </Dialog.Panel>
                                                        </Transition.Child>
                                                    </div>
                                                </div>
                                            </Dialog>
                                        </Transition>
                                        <div className="relative">
                                            <input type="text" className="peer form-input w-auto m-1 p-2 ltr:pr-11 rtl:pl-11" placeholder="ค้นหา..." value={search} onChange={(e) => setSearch(e.target.value)} />
                                            <button type="button" className="absolute top-1/2 -translate-y-1/2 peer-focus:text-primary ltr:right-[11px] rtl:left-[11px]">
                                                <IconSearch className="mx-auto" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="datatables">
                                    <DataTable
                                        tableRef={tableRef}
                                        highlightOnHover
                                        striped
                                        noRecordsText="ไม่พบข้อมูล"
                                        className="table-hover whitespace-nowrap"
                                        textSelectionDisabled={isTouch}
                                        records={recordsData}
                                        onRowContextMenu={({ event }) =>
                                            showContextMenu([])(event)}
                                        columns={[
                                            { accessor: 'Target_ID', title: 'รหัสพนักงาน', sortable: true },
                                            { accessor: 'Target_Name', title: 'ชื่อ-นามสกุล', sortable: true },
                                            { accessor: 'Target_Position', title: 'ตำแหน่ง', sortable: true },
                                            { accessor: 'Target_Sector', title: 'สังกัด', sortable: true },
                                            {
                                                accessor: 'Action',
                                                title: 'ดำเนินการ',
                                                titleClassName: '!text-center',
                                                render: ({ id, Status }) => (
                                                    <div>
                                                        {actionStatusList(id, Status)}
                                                    </div>
                                                ),
                                            },
                                        ]}
                                        totalRecords={initialRecords.length}
                                        recordsPerPage={pageSize}
                                        recordsPerPageLabel={`จำนวนรายการต่อหน้า`}
                                        page={page}
                                        onPageChange={(p) => setPage(p)}
                                        recordsPerPageOptions={PAGE_SIZES}
                                        onRecordsPerPageChange={setPageSize}
                                        sortStatus={sortStatus}
                                        onSortStatusChange={setSortStatus}
                                        minHeight={200}
                                        paginationText={({ from, to, totalRecords }) => `แสดงจาก  ${from} ถึง ${to} จากทั้งหมด ${totalRecords} รายการ`}
                                        paginationActiveBackgroundColor="grape"
                                        loadingText="กำลังโหลด ใจเย็น ๆ..."
                                    />
                                </div>
                            </div>
                        </Tab.Panel>
                        <Tab.Panel>
                            <div>
                                <form className="mb-5 rounded-md border border-[#ebedf2] bg-white p-4 dark:border-[#191e3a] dark:bg-black">
                                    <h6 className="mb-5 text-lg">ข้อมูลการเผยแพร่</h6>
                                    <div>
                                        <div className="grid grid-cols-1 gap-5 mb-5 sm:grid-cols-2">
                                            <div>
                                                <label htmlFor="start_publish">{t('เริ่มต้นเผยแพร่')}</label>
                                                <Flatpickr
                                                    data-enable-time
                                                    options={{
                                                        enableTime: true,
                                                        time_24hr: true,
                                                        dateFormat: 'd-m-Y H:i',
                                                    }}
                                                    value={start_publish}
                                                    className="form-input"
                                                    onChange={(start_publish) => set_start_publish(start_publish)}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="end_publish">{t('สิ้นสุดเผยแพร่')}</label>
                                                <Flatpickr
                                                    data-enable-time
                                                    options={{
                                                        enableTime: true,
                                                        time_24hr: true,
                                                        dateFormat: 'd-m-Y H:i',
                                                    }}
                                                    value={end_publish}
                                                    className="form-input"
                                                    onChange={(end_publish) => set_end_publish(end_publish)}
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-5">
                                            <div className="inline-flex mb-2">
                                                <label htmlFor="selection_publish">{t('ลักษณะการเผยแพร่')}</label>
                                                <button type="button" onClick={() => setTypePublishModel(true)} className="inline-flex ml-1 text-primary text-center">
                                                    <FaCircleInfo className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                                                </button>
                                            </div>
                                            <div>
                                                <Transition appear show={TypePublishModel} as={Fragment}>
                                                    <Dialog as="div" open={TypePublishModel} onClose={() => setTypePublishModel(false)}>
                                                        <Transition.Child
                                                            as={Fragment}
                                                            enter="ease-out duration-300"
                                                            enterFrom="opacity-0"
                                                            enterTo="opacity-100"
                                                            leave="ease-in duration-200"
                                                            leaveFrom="opacity-100"
                                                            leaveTo="opacity-0"
                                                        >
                                                            <div className="fixed inset-0" />
                                                        </Transition.Child>
                                                        <div id="standard_modal" className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
                                                            <div className="flex items-start justify-center min-h-screen px-4">
                                                                <Transition.Child
                                                                    as={Fragment}
                                                                    enter="ease-out duration-300"
                                                                    enterFrom="opacity-0 scale-95"
                                                                    enterTo="opacity-100 scale-100"
                                                                    leave="ease-in duration-200"
                                                                    leaveFrom="opacity-100 scale-100"
                                                                    leaveTo="opacity-0 scale-95"
                                                                >
                                                                    <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg my-8 text-black dark:text-white-dark">
                                                                        <div className="flex py-2 bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-center">
                                                                            <span className="flex items-center justify-center w-16 h-16 rounded-full bg-[#f1f2f3] dark:bg-white/10">
                                                                                <MdHelpOutline className="h-14 w-14 text-primary" />
                                                                            </span>
                                                                        </div>
                                                                        <div className="p-5">
                                                                            <div className="py-5 text-white-dark text-start">
                                                                                <p>
                                                                                    ภายใน กฟภ. คือแบบฟอร์มที่ใช้ได้เฉพาะพนักงานหรือลูกจ้างที่กำหนดไว้และจำเป็นต้องเข้าสู่ระบบเพื่อทำแบบสำรวจ (เหมาะสำหรับติดตามและประเมินรายบุคคล)
                                                                                </p>
                                                                                <br />
                                                                                <hr />
                                                                                <br />
                                                                                <p>
                                                                                    สาธารณะ คือแบบฟอร์มเปิดที่สามารถเข้าถึงได้โดยไม่จำเป็นต้องเข้าสู่ระบบ (เหมาะสำหรับบุคคลภายนอกหรือไม่ระบุตัวตน)
                                                                                </p>
                                                                            </div>
                                                                            <div className="flex justify-center items-center mt-8">
                                                                                <button type="button" onClick={() => setTypePublishModel(false)} className="btn btn-primary ltr:ml-4 rtl:mr-4">
                                                                                    {t('ฉันเข้าใจแล้ว')}
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </Dialog.Panel>
                                                                </Transition.Child>
                                                            </div>
                                                        </div>
                                                    </Dialog>
                                                </Transition>
                                            </div>

                                            <div className="flex-5 mb-5">
                                                <label className="inline-flex mr-3">
                                                    <input
                                                        type="radio"
                                                        name="internal_form"
                                                        className="form-radio peer"
                                                        checked={isInternalForm}
                                                        onChange={handleInternalFormChange}
                                                    />
                                                    <span className="peer-checked:text-primary">{t('ภายใน กฟภ.')}</span>
                                                </label>
                                                <label className="inline-flex">
                                                    <input
                                                        type="radio"
                                                        name="external_form"
                                                        className="form-radio text-success peer"
                                                        checked={!isInternalForm}
                                                        onChange={handleExternalFormChange}
                                                    />
                                                    <span className="peer-checked:text-success">{t('สาธารณะ')}</span>
                                                </label>
                                            </div>

                                            {isInternalForm && (
                                                <div className="grid mb-5">
                                                    <div className="panel mb-5">
                                                        <div className="mb-4.5 flex flex-col justify-between gap-5 md:flex-row md:items-center">
                                                            <div className="flex flex-wrap items-center">
                                                                <h2 className="text-xl">{t('กลุ่มเป้าหมาย')}</h2>
                                                            </div>

                                                            <div className='flex flex-wrap items-end'>
                                                                <button type="button" onClick={() => setAddTargetModal(true)} className="btn btn-primary m-1 p-2">
                                                                    <span>
                                                                        <FaUserPlus className="h-5 w-5 ltr:mr-1 rtl:ml-1" />
                                                                    </span>
                                                                    &nbsp;{t('เพิ่มเป้าหมาย')}
                                                                </button>
                                                                <Transition appear show={AddTargetModal} as={Fragment}>
                                                                    <Dialog as="div" open={AddTargetModal} onClose={() => setAddTargetModal(true)}>
                                                                        <Transition.Child
                                                                            as={Fragment}
                                                                            enter="ease-out duration-300"
                                                                            enterFrom="opacity-0"
                                                                            enterTo="opacity-100"
                                                                            leave="ease-in duration-200"
                                                                            leaveFrom="opacity-100"
                                                                            leaveTo="opacity-0"
                                                                        >
                                                                            <div className="fixed inset-0" />
                                                                        </Transition.Child>
                                                                        <div className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
                                                                            <div className="flex items-start justify-center min-h-screen px-4">
                                                                                <Transition.Child
                                                                                    as={Fragment}
                                                                                    enter="ease-out duration-300"
                                                                                    enterFrom="opacity-0 scale-95"
                                                                                    enterTo="opacity-100 scale-100"
                                                                                    leave="ease-in duration-200"
                                                                                    leaveFrom="opacity-100 scale-100"
                                                                                    leaveTo="opacity-0 scale-95"
                                                                                >
                                                                                    <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-5xl my-8 text-black dark:text-white-dark">
                                                                                        <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                                                                            <h5 className="font-bold text-lg">เพิ่มเป้าหมาย</h5>
                                                                                            <button onClick={() => setAddTargetModal(false)} type="button" className="text-white-dark hover:text-dark">
                                                                                                <MdOutlineClose />
                                                                                            </button>
                                                                                        </div>
                                                                                        <div className="p-5">
                                                                                            {/* Panel ค้นหาพนักงานผู้จัดการ */}
                                                                                            <div className="panel">
                                                                                                <div className="mb-4.5 flex flex-col justify-between gap-5 md:flex-row md:items-center">
                                                                                                    <div className="flex items-center">
                                                                                                        <h2 className="text-xl">{t('ค้นหาชื่อพนักงาน')}</h2>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <form>
                                                                                                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-5">
                                                                                                        <input type="text" placeholder="รหัสพนักงานหรือชื่อ" className="form-input lg:col-span-2" />
                                                                                                        <input type="text" placeholder="ตำแหน่ง" className="form-input" />
                                                                                                        <input type="text" placeholder="สังกัด" className="form-input" />
                                                                                                    </div>
                                                                                                    <div className="flex justify-center item-center">
                                                                                                        <button type="button" className="btn btn-primary">
                                                                                                            <MdSearch className="w-4 h-4 mr-1" />
                                                                                                            {t('ค้นหา')}
                                                                                                        </button>
                                                                                                    </div>
                                                                                                </form>
                                                                                            </div>

                                                                                            {/* Panel รายชื่อเตรียมเพิ่ม */}
                                                                                            <div className="panel mt-5">
                                                                                                <div className="mb-4.5 flex flex-col justify-between gap-5 md:flex-row md:items-center">
                                                                                                    <div className="flex flex-wrap items-center">
                                                                                                        <h2 className="text-xl">{t('รายการข้อมูล')}</h2>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="datatables">
                                                                                                    <DataTable
                                                                                                        tableRef={tableRef}
                                                                                                        highlightOnHover
                                                                                                        striped
                                                                                                        noRecordsText="ไม่พบข้อมูล"
                                                                                                        className="table-hover whitespace-nowrap"
                                                                                                        textSelectionDisabled={isTouch}
                                                                                                        records={recordsData}
                                                                                                        selectedRecords={selectedRecords}
                                                                                                        onSelectedRecordsChange={setSelectedRecords}
                                                                                                        onRowContextMenu={({ event }) =>
                                                                                                            showContextMenu([])(event)}
                                                                                                        columns={[
                                                                                                            { accessor: 'Target_ID', title: 'รหัสพนักงาน', sortable: true },
                                                                                                            { accessor: 'Target_Name', title: 'ชื่อ-นามสกุล', sortable: true },
                                                                                                            { accessor: 'Target_Position', title: 'ตำแหน่ง', sortable: true },
                                                                                                            { accessor: 'Target_Sector', title: 'สังกัด', sortable: true },
                                                                                                        ]}
                                                                                                        totalRecords={initialRecords.length}
                                                                                                        recordsPerPage={pageSize}
                                                                                                        page={page}
                                                                                                        onPageChange={(p) => setPage(p)}
                                                                                                        sortStatus={sortStatus}
                                                                                                        onSortStatusChange={setSortStatus}
                                                                                                        minHeight={200}
                                                                                                        paginationText={({ from, to, totalRecords }) => `แสดงจาก  ${from} ถึง ${to} จากทั้งหมด ${totalRecords} รายการ`}
                                                                                                        paginationActiveBackgroundColor="grape"
                                                                                                        loadingText="กำลังโหลด ใจเย็น ๆ..."
                                                                                                    />
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="flex justify-center items-center mt-8">
                                                                                                <button onClick={() => setAddTargetModal(false)} type="button" className="btn btn-outline-danger">
                                                                                                    ยกเลิก
                                                                                                </button>
                                                                                                <button onClick={() => setAddTargetModal(false)} type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4">
                                                                                                    เพิ่มรายการ
                                                                                                </button>
                                                                                            </div>
                                                                                        </div>
                                                                                    </Dialog.Panel>
                                                                                </Transition.Child>
                                                                            </div>
                                                                        </div>
                                                                    </Dialog>
                                                                </Transition>

                                                                <div className="relative">
                                                                    <input type="text" className="peer form-input w-auto m-1 p-2 ltr:pr-11 rtl:pl-11" placeholder="ค้นหา..." value={search} onChange={(e) => setSearch(e.target.value)} />
                                                                    <button type="button" className="absolute top-1/2 -translate-y-1/2 peer-focus:text-primary ltr:right-[11px] rtl:left-[11px]">
                                                                        <IconSearch className="mx-auto" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="datatables">
                                                            <DataTable
                                                                tableRef={tableRef}
                                                                highlightOnHover
                                                                striped
                                                                noRecordsText="ไม่พบข้อมูล"
                                                                className="table-hover whitespace-nowrap"
                                                                textSelectionDisabled={isTouch}
                                                                records={recordsData}
                                                                onRowContextMenu={({ event }) =>
                                                                    showContextMenu([])(event)}
                                                                columns={[
                                                                    { accessor: 'Target_ID', title: 'รหัสพนักงาน', sortable: true },
                                                                    { accessor: 'Target_Name', title: 'ชื่อ-นามสกุล', sortable: true },
                                                                    { accessor: 'Target_Position', title: 'ตำแหน่ง', sortable: true },
                                                                    { accessor: 'Target_Sector', title: 'สังกัด', sortable: true },
                                                                    {
                                                                        accessor: 'Action',
                                                                        title: 'ดำเนินการ',
                                                                        titleClassName: '!text-center',
                                                                        render: ({ id, Status }) => (
                                                                            <div>
                                                                                {actionStatusList(id, Status)}
                                                                            </div>
                                                                        ),
                                                                    },
                                                                ]}
                                                                totalRecords={initialRecords.length}
                                                                recordsPerPage={pageSize}
                                                                recordsPerPageLabel={`จำนวนรายการต่อหน้า`}
                                                                page={page}
                                                                onPageChange={(p) => setPage(p)}
                                                                recordsPerPageOptions={PAGE_SIZES}
                                                                onRecordsPerPageChange={setPageSize}
                                                                sortStatus={sortStatus}
                                                                onSortStatusChange={setSortStatus}
                                                                minHeight={200}
                                                                paginationText={({ from, to, totalRecords }) => `แสดงจาก  ${from} ถึง ${to} จากทั้งหมด ${totalRecords} รายการ`}
                                                                paginationActiveBackgroundColor="grape"
                                                                loadingText="กำลังโหลด ใจเย็น ๆ..."
                                                            />
                                                        </div>
                                                    </div>
                                                    <label htmlFor="start_publish">จำกัดให้ตอบกลับได้เพียง 1 ครั้ง</label>
                                                    <label className="w-12 h-6 relative mb-4">
                                                        <input
                                                            type="checkbox"
                                                            className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                                                            id="custom_switch_checkbox1"
                                                        />
                                                        <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                                    </label>
                                                    <label htmlFor="start_publish">อนุญาตให้แก้ไขคำตอบ</label>
                                                    <label className="w-12 h-6 relative">
                                                        <input
                                                            type="checkbox"
                                                            className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                                                            id="custom_switch_checkbox2"
                                                        />
                                                        <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap">
                                            <button type="button" className="btn btn-primary mr-3" onClick={() => showSweetAlert(20)}>
                                                {t('บันทึกและเผยแพร่ทันที')}
                                            </button>
                                            <button type="button" className="btn btn-info" onClick={() => showSweetAlert(10)}>
                                                {t('บันทึกร่าง')}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </Tab.Panel>
                    </Tab.Panels>
                </Tab.Group>
            )}
        </div>
    );
};

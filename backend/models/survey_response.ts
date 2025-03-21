class survey_response
{
    id!: string;
    survey_title!: string;
    creator_id!: number;
    publish_date!: Date;
    expire_date!: Date;
    qr_code!: string;
    short_link!: string;
    status!: number;
    status_text!: string;
    sector_creator!: string;
    tel!: string;
    approver_id?: number;
    is_outsider_allowed!: boolean;
    created_at?: Date;
    created_by!: number;
    update_at?: Date;
    update_by!: number;
    content_survey!: object;
}
class creator_info{
    division!: string;
    phone!: string;
}
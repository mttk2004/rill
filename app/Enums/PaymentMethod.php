<?php

namespace App\Enums;

enum PaymentMethod: string
{
    case COD = 'cod';
    case VNPAY = 'vnpay';
}

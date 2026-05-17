<?php

namespace App\Repositories\Contracts;

use App\Models\Photographer;

interface PhotographerRepositoryInterface
{
    public function current(): ?Photographer;

    public function findByUserId(int $userId): ?Photographer;

    public function create(array $data): Photographer;

    public function update(Photographer $photographer, array $data): Photographer;
}

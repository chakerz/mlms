import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Plus, Pencil, ToggleLeft, ToggleRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardTable } from '@/shared/ui/Card'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'
import { DataTable, Column, TablePagination } from '@/shared/ui/Table'
import { useGetUsersQuery, useUpdateUserMutation, UserDto } from '@/features/user/api/userApi'
import { formatDate } from '@/shared/utils/formatDate'

const ROLE_VARIANT: Record<string, 'gray' | 'blue' | 'green' | 'yellow' | 'orange' | 'red' | 'emerald'> = {
  ADMIN:      'red',
  PHYSICIAN:  'emerald',
  TECHNICIAN: 'blue',
  RECEPTION:  'yellow',
}

export function UserListPage() {
  const { t } = useTranslation(['users', 'common'])
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const pageSize = 20

  const { data, isLoading } = useGetUsersQuery({ page, pageSize })
  const [updateUser] = useUpdateUserMutation()

  const handleToggleActive = async (user: UserDto) => {
    await updateUser({ id: user.id, isActive: !user.isActive })
  }

  const columns: Column<UserDto>[] = [
    {
      key: 'email',
      header: t('common:labels.email'),
      render: (_, u) => <span className="font-medium text-foreground">{u.email}</span>,
    },
    {
      key: 'role',
      header: t('users:form.role'),
      render: (_, u) => (
        <Badge variant={ROLE_VARIANT[u.role] ?? 'gray'}>
          {t(`users:roles.${u.role}`)}
        </Badge>
      ),
    },
    {
      key: 'language',
      header: t('users:form.language'),
      render: (_, u) => t(`common:language.${u.language.toLowerCase()}`),
    },
    {
      key: 'isActive',
      header: t('users:form.active'),
      render: (_, u) => (
        <Badge variant={u.isActive ? 'green' : 'gray'}>
          {u.isActive ? t('common:labels.yes') : t('common:labels.no')}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      header: t('common:labels.createdAt'),
      render: (_, u) => <span className="text-xs text-muted-foreground">{formatDate(u.createdAt)}</span>,
    },
    {
      key: 'actions' as keyof UserDto,
      header: t('common:labels.actions'),
      render: (_, u) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => { e.stopPropagation(); navigate(`/users/${u.id}/edit`) }}
            title={t('common:actions.edit')}
          >
            <Pencil className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => { e.stopPropagation(); handleToggleActive(u) }}
            title={u.isActive ? t('users:actions.deactivate') : t('users:actions.activate')}
          >
            {u.isActive
              ? <ToggleRight className="size-4 text-green-600" />
              : <ToggleLeft className="size-4 text-muted-foreground" />}
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">{t('users:title')}</h1>
        <Button onClick={() => navigate('/users/new')}>
          <Plus className="size-4" />
          {t('users:actions.create')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('users:title')}</CardTitle>
        </CardHeader>
        <CardTable>
          <DataTable
            columns={columns}
            data={data?.data ?? []}
            keyExtractor={(u) => u.id}
            loading={isLoading}
          />
        </CardTable>
        <TablePagination
          page={page}
          pageSize={pageSize}
          total={data?.total ?? 0}
          onPageChange={setPage}
        />
      </Card>
    </div>
  )
}

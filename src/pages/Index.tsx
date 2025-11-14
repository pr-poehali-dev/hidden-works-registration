import { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

interface Act {
  id: string;
  number: string;
  title: string;
  project: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  photos: number;
  certificates: number;
}

export default function Index() {
  const [acts, setActs] = useState<Act[]>([
    {
      id: '1',
      number: 'АСР-001',
      title: 'Акт на скрытые работы по устройству фундамента',
      project: 'ЖК "Новый горизонт"',
      date: '2024-11-10',
      status: 'approved',
      photos: 8,
      certificates: 3
    },
    {
      id: '2',
      number: 'АСР-002',
      title: 'Акт на скрытые работы по армированию плиты перекрытия',
      project: 'ЖК "Новый горизонт"',
      date: '2024-11-12',
      status: 'pending',
      photos: 12,
      certificates: 2
    },
    {
      id: '3',
      number: 'АСР-003',
      title: 'Акт освидетельствования скрытых работ по гидроизоляции',
      project: 'ТЦ "Метрополис"',
      date: '2024-11-13',
      status: 'approved',
      photos: 6,
      certificates: 4
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const stats = {
    total: acts.length,
    approved: acts.filter(a => a.status === 'approved').length,
    pending: acts.filter(a => a.status === 'pending').length,
    rejected: acts.filter(a => a.status === 'rejected').length,
  };

  const getStatusBadge = (status: Act['status']) => {
    const variants = {
      pending: { variant: 'secondary' as const, label: 'На рассмотрении', icon: 'Clock' },
      approved: { variant: 'default' as const, label: 'Утвержден', icon: 'CheckCircle2' },
      rejected: { variant: 'destructive' as const, label: 'Отклонен', icon: 'XCircle' },
    };
    const config = variants[status];
    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        <Icon name={config.icon as any} size={12} />
        {config.label}
      </Badge>
    );
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="hover-scale">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Всего актов</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon name="FileText" size={20} className="text-primary" />
                </div>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-scale">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Утверждено</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <Icon name="CheckCircle2" size={20} className="text-green-600" />
                </div>
                <p className="text-3xl font-bold">{stats.approved}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-scale">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">На рассмотрении</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Icon name="Clock" size={20} className="text-amber-600" />
                </div>
                <p className="text-3xl font-bold">{stats.pending}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-scale">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Отклонено</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <Icon name="XCircle" size={20} className="text-red-600" />
                </div>
                <p className="text-3xl font-bold">{stats.rejected}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Последние акты</CardTitle>
                <CardDescription>Актуальный список актов на скрытые работы</CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Icon name="Plus" size={16} className="mr-2" />
                    Создать акт
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Новый акт на скрытые работы</DialogTitle>
                    <DialogDescription>
                      Заполните данные и прикрепите фотофиксацию и сертификаты
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="act-number">Номер акта</Label>
                        <Input id="act-number" placeholder="АСР-004" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="act-date">Дата</Label>
                        <Input id="act-date" type="date" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="project">Проект</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите проект" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="project1">ЖК "Новый горизонт"</SelectItem>
                          <SelectItem value="project2">ТЦ "Метрополис"</SelectItem>
                          <SelectItem value="project3">Бизнес-центр "Альфа"</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="title">Наименование работ</Label>
                      <Input id="title" placeholder="Акт на скрытые работы по..." />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Описание</Label>
                      <Textarea 
                        id="description" 
                        placeholder="Подробное описание выполненных работ"
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Фотофиксация</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          id="photos"
                          onChange={(e) => setSelectedFiles(e.target.files)}
                        />
                        <label htmlFor="photos" className="cursor-pointer">
                          <Icon name="Upload" size={32} className="mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm font-medium">Загрузите фотографии</p>
                          <p className="text-xs text-muted-foreground mt-1">PNG, JPG до 10MB</p>
                          {selectedFiles && (
                            <p className="text-xs text-primary mt-2">
                              Выбрано файлов: {selectedFiles.length}
                            </p>
                          )}
                        </label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Сертификаты</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                        <input
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          id="certificates"
                        />
                        <label htmlFor="certificates" className="cursor-pointer">
                          <Icon name="FileUp" size={32} className="mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm font-medium">Загрузите сертификаты</p>
                          <p className="text-xs text-muted-foreground mt-1">PDF, DOC до 10MB</p>
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Отмена
                      </Button>
                      <Button onClick={() => setIsDialogOpen(false)}>
                        Создать акт
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {acts.map((act) => (
                <Card key={act.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-mono text-muted-foreground">{act.number}</span>
                          {getStatusBadge(act.status)}
                        </div>
                        <h3 className="font-semibold mb-1">{act.title}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Icon name="Folder" size={14} />
                          {act.project}
                        </p>
                      </div>
                      <div className="text-right space-y-2">
                        <p className="text-sm text-muted-foreground flex items-center gap-1 justify-end">
                          <Icon name="Calendar" size={14} />
                          {new Date(act.date).toLocaleDateString('ru-RU')}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Icon name="Image" size={12} />
                            {act.photos}
                          </span>
                          <span className="flex items-center gap-1">
                            <Icon name="Award" size={12} />
                            {act.certificates}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
